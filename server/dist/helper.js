import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
export const formatError = (error) => {
    let errors = {};
    error.errors?.map(issue => {
        errors[issue.path?.[0]] = issue.message;
    });
    return errors;
};
export const renderEmailEjs = async (fileName, payload) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const html = await ejs.renderFile(`${__dirname}/views/emails/${fileName}.ejs`, payload);
    return html;
};
