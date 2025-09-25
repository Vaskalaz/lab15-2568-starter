import express, { type NextFunction } from "express";
import morgan from 'morgan';
import { type Request, type Response } from "express";
import routerS from "./routes/studentRoutes.js";
import routerC from "./routes/courseRoutes.js";

const app: any = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "lab 15 API service successfully"
  });
});

app.get("/me", (req: Request, res: Response) => {
  try {
    res.status(200).json({ 
      success: true,
      message: "Student Information",
      data: {
        studentId: "670610700",
        firstName: "Thanaphat",
        lastName: "Wongchan",
        program: "CPE",
        section: "001",  
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      data: null,
    });
  }
});

app.use("/api/v2", routerS);
app.use("/api/v2", routerC);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;
