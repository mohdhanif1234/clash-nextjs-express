import express, { Application, Request, Response } from "express"
import "dotenv/config";
import path from "path"
import { fileURLToPath } from "url"
import ejs from "ejs"
import { sendEmail } from "./config/mail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app: Application = express();

const PORT = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"))

app.get('/', async (req: Request, res: Response) => {
    const html = await ejs.renderFile(`${__dirname}/views/emails/welcome.ejs`, { name: "Mohammad Hanif" })
    await sendEmail('mohdhanif.topia@nwwww18.com', 'Testing SMTP', html)
    return res.json({ msg: 'Email sent successfully!' })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})