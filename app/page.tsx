import { RowDataPacket } from "mysql2";
import { databaseConnection, isConnectionOpen } from "../lib/db";
import ReviewSubmit from "../components/reviewSubmit";
import ReviewsContainer from "../components/reviewsContainer";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export const revalidate : number = 0;

interface ReviewRow extends RowDataPacket {
    id: number,
    user: string,
    review: string,
    date: Date,
    rating: number
}

async function checkDatabase() : Promise<void> {
    try {
        const connection : Connection = databaseConnection();

        if (await isConnectionOpen(connection)) {
            const [result] = await connection.promise().query<RowDataPacket[]>('SHOW TABLES LIKE "reviews"');

            if (Array.isArray(result) && result.length > 0) {
                connection.end();
                return;
            }
            else {
                await connection.promise().query(`
                    CREATE TABLE IF NOT EXISTS reviews (
                        id INT(11) NOT NULL AUTO_INCREMENT,
                        user VARCHAR(255) NOT NULL,
                        review TEXT NOT NULL,
                        \`date\` DATETIME DEFAULT NULL,
                        rating INT(11) DEFAULT NULL,
                        user_id VARCHAR(45) DEFAULT NULL,
                        PRIMARY KEY (id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
                `);
                connection.end();
            }
        }
        else {
            throw new Error('Cannot connect to database.');
        }
    }
    catch (error : any) {
        throw error;
    }
}

async function getReviews() : Promise<ReviewRow[]> {
    try {
        const connection : Connection = databaseConnection();

        if (await isConnectionOpen(connection)) {
            const [rows] = await connection.promise().query<ReviewRow[]>('SELECT id, user, review, date, rating FROM reviews ORDER BY date DESC');
            connection.end();
            return rows;
        }
        else {
            throw new Error('Could not connect to database.');
        }
    }
    catch (error: any) {
        throw error;
    }
}

export default async function Page() {
    await checkDatabase();
    const review_list : ReviewRow[] = await getReviews();

    return (
        <>
            <ReviewSubmit />
            <ReviewsContainer reviews={review_list}/>
        </>
    );
}