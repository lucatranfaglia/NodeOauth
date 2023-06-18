import {object, string, TypeOf } from "zod";

/**
 * Schema User: create (post)
 */
export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required"
    }),
    lastName: string({
      required_error: "Last name is required"
    }),
    password: string({
      required_error: "Passowrd is required"
    }).min(6, "Password is too short - should be min 6 characters."),
    passwordConfirmation: string({
      required_error: "Passowrd confirmation is required"
    }),
    email: string({
      required_error: "Email is required"
    }).email("Not a valid email"),
 
  }).refine((data:any)=>data.password===data.passwordConfirmation, {
    message: "Passwords do note match",
    path: ["passwordConfirmation"],
  })
});
export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];


/**
 * Schema User: verify (get)
 */
export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string()
  }) 
})
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];

/**
 * Schema Forgot password
 */
export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required"
    }).email("Not a valid email"),
  })
})
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

/**
 * Schema Reset new password
 */
export const resetPasswordSchema = object({
  params: object({
    id:string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Passowrd is required"
    }).min(6, "Password is too short - should be min 6 characters."),
    passwordConfirmation: string({
      required_error: "Passowrd confirmation is required"
    })
    
  }).refine((data:any)=>data.password===data.passwordConfirmation, {
    message: "Passwords do note match",
    path: ["passwordConfirmation"],
  })
})
// params + body
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

