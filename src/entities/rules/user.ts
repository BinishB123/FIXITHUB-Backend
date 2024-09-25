export interface user{
    name: string,
    mobile: number,
    email: string,
    password: string
    blocked:boolean
}

export interface userSignIn{
      email:string,
      password:string
}

// interface for data that going as response from repo
export interface userResponseData{
    id:string,
    name:string,
    email:string,
    mobile:string,
    blocked:boolean
}


export default user