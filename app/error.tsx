'use client'
export default function Error({error} : { error: Error & { digest? : string} }) {

    if (error.message === 'Cannot connect to database.') {
        return (
            <>
                <div>
                    <h2>Could not connect to the database. Please, try again later.</h2>
                </div>
                <div>
                    <button className="btn tryagain" onClick={() => window.location.reload()}>Try again</button>
                </div>
            </>
        );
    }
}