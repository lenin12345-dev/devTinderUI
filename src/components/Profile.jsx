import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "../utils/userSlice";
// import { Card } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    photoUrl: "",
    skills: "",
  });

  useEffect(() => {
    if (user) {
      setEditUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        photoUrl: user.photoUrl || "",
        skills: user.skills || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/profile/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      dispatch(loginRequest(data?.data));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardContent className="flex flex-col items-center p-6 space-y-4">
          <img
            src={editUser.photoUrl || "https://via.placeholder.com/150"}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-sm"
          />
          <h2 className="text-xl font-semibold text-center">Edit Your Profile</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full space-y-3"
          >
            {[
              { name: "firstName", label: "First Name" },
              { name: "lastName", label: "Last Name" },
              { name: "age", label: "Age" },
              { name: "gender", label: "Gender" },
              { name: "photoUrl", label: "Photo URL" },
              { name: "skills", label: "Skills" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col space-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={editUser[field.name]}
                  onChange={handleChange}
                  placeholder={field.label}
                  className="w-full"
                />
              </div>
            ))}

            <Button type="submit" className="w-full mt-4">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Profile;
