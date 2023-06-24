import UserModel, { User } from "../model/user.model";

/**
 * Create new user
 * @param input 
 * @returns 
 */
export async function createUser(input: Partial<User>){
  return UserModel.create(input)
}
// -----------------------------------------------
/**
 * Find user by ID
 * @param id 
 * @returns 
 */
export async function findUserById(id: string){
  return UserModel.findById(id);
}
// -----------------------------------------------
/**
 * Find user by email
 * @param email 
 * @returns 
 */
export async function findUserByEmail(email: string){
  // return UserModel.findOne({email}).lean();
  return UserModel.findOne({email});
}