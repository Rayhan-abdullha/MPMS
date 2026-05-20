import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV || "development",
  access_token_secret: process.env.JWT_SECRET || "my-token",
  refresh_token_secret: process.env.JWT_REFRESH_SECRET || "my-token",
};

export default config;
