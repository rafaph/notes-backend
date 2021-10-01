import express from "express";

const app = express();

app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("Server running at http://localhost:3000");
});
