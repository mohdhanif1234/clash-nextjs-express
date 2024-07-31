import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import Routes from "./routes/index.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(appLimiter);
// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
// Routes
app.use(Routes);
app.get('/', async (req, res) => {
    const html = await ejs.renderFile(`${__dirname}/views/emails/welcome.ejs`, { name: "Mohammad Hanif" });
    await emailQueue.add(emailQueueName, {
        to: 'hanif.topia@gmail.com',
        subject: 'Testing SMTP',
        body: html
    });
    return res.json({ msg: 'Email sent successfully!' });
});
// Queues
import "./jobs/index.js";
import { emailQueue, emailQueueName } from "./jobs/EmailJob.js";
import { appLimiter } from "./config/rateLimit.js";
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
