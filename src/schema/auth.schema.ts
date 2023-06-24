import {object, string, TypeOf } from "zod";


export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required"
    }).email("Not a valid email"),
    password: string({
      required_error: "Passowrd is required"
    }).min(6, "Invalid email or passowrd."),
  })
})

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];