export async function getUser(req,res){
    res.status(200).send("Getting user right now");
}

export async function createUser(req,res){
    res.status(201).json({message: "user created successfully"})
}

export async function updateUser(req,res) {
    res.status(200).json({message: "user updated successfully"})
}

export async function deleteUser(req,res) {
    res.status(200).json({message: "user deleted successfully"})
}