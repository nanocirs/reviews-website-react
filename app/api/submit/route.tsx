import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { databaseConnection, isConnectionOpen } from '../../../lib/db';
import { RowDataPacket, Connection } from "mysql2";
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

interface FormData {
    user: string;
    review: string;
    rating: number;
}

interface ResponseJSON {
    warning: [number, string][];
    published: boolean;
}

export async function POST(req : Request) : Promise<NextResponse> {
    const data : FormData = await req.json()

    let rating : number = data.rating;
    const user : string = data.user;
    const review : string = data.review;

    let warnings : [number, string][] = [];

    if (user.length < 3) { warnings.push([0, 'Username is too short. It must be at least 3 characters long.']); }
    else if (user.length > 32) { warnings.push([1, 'Username is too long. It must be at most 32 characters long.']); }

    if (review.length < 1) { warnings.push([2, 'Write a review.']); }
    else if (review.length > 500) { warnings.push([3, 'Review is too long.']); }

    if (rating < 1) { warnings.push([4, 'You must at least provide one star.']); }
    else if (rating > 5) { rating = 5; }

    let response : ResponseJSON = {
        warning: warnings,
        published: false
    }

    if (warnings.length === 0) {
        try {            
            const connection : Connection = databaseConnection();
            const cookieManager : ReadonlyRequestCookies = cookies();
            const storedUserId : RequestCookie = cookieManager.get('user_id');

            if (await isConnectionOpen(connection)) {
                if (storedUserId !== undefined) {
                    const [rows] = await connection.promise().query<RowDataPacket[]>('SELECT COUNT(*) as count FROM reviews WHERE user_id = ? AND UTC_TIMESTAMP() < DATE_ADD(date, INTERVAL 2 HOUR)', [storedUserId.value]);
                    
                    if (rows[0].count > 0) { 
                        warnings.push([5, 'You can only post a review once every 2 hours.']);
                        response.warning = warnings;
                        connection.end();
                                                
                        return NextResponse.json(response);
                    }   
                }

                const { v4: uuidv4 } = require('uuid');
                const userId : string = uuidv4();

                await connection.promise().query('INSERT INTO reviews (user_id, user, review, rating, date) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())', [userId, user, review, rating]);
                connection.end();
                
                cookieManager.set({
                    name: 'user_id',
                    value: userId,
                    expires: new Date(new Date().getTime() + (2 * 60 * 60 * 1000)),
                    path: '/',
                    sameSite: 'none',
                    secure: false 
                });
                response.published = true;
            }
            else {
                throw new Error('Cannot connect to database.');
            }
        }
        catch (error) {
            throw error;
        }
    }
    return NextResponse.json(response);
}
