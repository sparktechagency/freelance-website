import config from "../config";

export const imageUrlGenarate = (url: string) => `http://${config.ip}:${config.port}/${url}`;