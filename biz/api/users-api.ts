export const signIn = async (id_token: string): Promise<number> => {
    const res = await fetch("http://localhost:3000/backend/v1/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${id_token}`,
        },
    });

    return res.status;
};
