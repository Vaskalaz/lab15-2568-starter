import { Router, type Request, type Response } from "express";
import { type Course } from "../libs/types.js";
import { courses } from "../db/db.js";
import {
  zCourseDeleteBody,
  zCoursePostBody,
  zCoursePutBody,
  zCourseId,
} from "../schemas/courseValidator.js";

const routerC: Router = Router();

// READ all
routerC.get("/courses", (req: Request, res: Response) => {
  try {
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, please try again",
      error: error,
    });
  }
});

// READ one by courseId (should be /courses/:courseId)
routerC.get("/courses/:courseId", (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const result = zCourseId.safeParse(courseId);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }
    const foundCourse = courses.findIndex(
      (course) => course.courseId === courseId
    );
    if (foundCourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }
    res.set("Link", `/courses/${courseId}`);
    return res.status(200).json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: courses[foundCourse],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error,
    });
  }
});

routerC.post("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;
    const result = zCoursePostBody.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }
    const foundCourse = courses.find(
      (course) => course.courseId === body.courseId
    );
    if (foundCourse) {
      return res.status(409).json({
        success: false,
        message: "Course Id already exists",
      });
    }
    res.set("Link", `/courses/${body.courseId}`);
    courses.push(body);

    return res.status(201).json({
      success: true,
      message: `Course ${body.courseId} has been added successfully`,
      data: body,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error,
    });
  }
});

routerC.put("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as Course;
    const result = zCoursePutBody.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }
    const foundCourse = courses.findIndex(
      (course) => course.courseId === body.courseId
    );
    if (foundCourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exist",
      });
    }
    res.set("Link", `/courses/${body.courseId}`);
    courses[foundCourse] = { ...courses[foundCourse], ...body };
    return res.status(200).json({
      success: true,
      message: `Course ${courses[foundCourse].courseId} has been updated successfully`,
      data: courses[foundCourse],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error,
    });
  }
});

routerC.delete("/courses", (req: Request, res: Response) => {
  try {
    const body = req.body as { courseId: number };
    const result = zCourseDeleteBody.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result.error.issues[0]?.message,
      });
    }

    const foundCourse = courses.findIndex(
      (course) => body.courseId === course.courseId
    );

    if (foundCourse === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exist",
      });
    }
    courses.splice(foundCourse, 1); 
    res.set("Link", `/courses/${body.courseId}`);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error,
    });
  }
});

export default routerC;
