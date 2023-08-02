import { databaseConnection, isConnectionOpen } from "../lib/db";
import ReviewSubmit from "../components/reviewSubmit";
import ReviewsContainer from "../components/reviewsContainer";

export const revalidate = 0;

async function checkDatabase() {
    try {
        const connection = databaseConnection();

        if (await isConnectionOpen(connection)) {
            const [result] = await connection.promise().query('SHOW TABLES LIKE "reviews"');

            if (result.length > 0) {
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
    catch (error) {
        throw error;
    }
}

export async function getReviews() {
    try {
        const connection = databaseConnection();

        if (await isConnectionOpen(connection)) {
            const [rows] = await connection.promise().query('SELECT id, user, review, date, rating FROM reviews ORDER BY date DESC');
            connection.end();
            return rows;
        }
        else {
            throw new Error('Could not connect to database.');
        }
    }
    catch (error) {
        throw error;
    }
}


export default async function Page() {
    await checkDatabase();

    const review_list = await getReviews();

    return (
        <>
            <ReviewSubmit />
            <ReviewsContainer reviews={review_list}/>
        </>
    );
}