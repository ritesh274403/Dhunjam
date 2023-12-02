import React, { useState } from "react";
import classes from "../styles/login.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Box, Typography } from "@mui/material";
import { setCurrentUser, signInApi } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        showPassword: false,
        showNameError: '',
        showPasswordError: '',
        showError: ''
    });
    function handleOnChange(e, type) {
        switch (type) {
            case "username":
                return setUserData({ ...userData, username: e?.target?.value });
            case "password":
                return setUserData({ ...userData, password: e?.target?.value });
            default:
                return setUserData({ ...userData });
        }
    }

    async function handleOnSignInBtn() {
        const { username, password } = userData;
        const isValidUsername = username && username.length >= 2;
        const isValidPassword = validatePassword(password);

        if (!isValidUsername && !isValidPassword) {
            setUserData({ ...userData, showError: "Please enter the username and password." });
        } else if (!isValidUsername) {
            setUserData({ ...userData, showNameError: "Username must contain characters between 2 to 60." });
        } else if (!isValidPassword) {
            setUserData({ ...userData, showPasswordError: "Please enter a strong password." });
        } else {
            try {
                const data = await signInApi({ username, password });
                setCurrentUser({ username, password, ...data });
                navigate("/");
            } catch (error) {
                setUserData({ ...userData, showError: "Username or Password is not valid" });
            }
        }
    }

    function validatePassword(password) {
        // Implement your password validation logic here
        var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return password && pattern.test(password);
    }

    return (
        <Box className={`${classes.container} main-container`}>
            <p className="heading">Venue Admin Login</p>
            <input
                className={classes.inputText}
                placeholder="Username"
                type="text"
                value={userData.username}
                onChange={(e) => handleOnChange(e, "username")}
            />
            {
                userData.showNameError && <Typography className={classes.errMsg} variant="span">{userData.showNameError}</Typography>
            }
            <br />

            <Box position={"relative"}>
                <input
                    className={classes.inputText}
                    placeholder="Password"
                    type={userData.showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={(e) => handleOnChange(e, "password")}
                />
                {userData.showPassword ? (
                    <VisibilityOff
                        className={classes.visibilityIcon}
                        onClick={() =>
                            setUserData({ ...userData, showPassword: !userData.showPassword })
                        }
                    />
                ) : (
                    <Visibility
                        className={classes.visibilityIcon}
                        onClick={() =>
                            setUserData({ ...userData, showPassword: !userData.showPassword })
                        }
                    />
                )}
            </Box>
            {
                userData.showPasswordError && <Typography className={classes.errMsg} variant="span">{userData.showPasswordError}</Typography>
            }
            {
                userData.showError && <Typography className={classes.errMsg} variant="span">{userData.showError}</Typography>
            }
            <Button variant="contained" className='submitBtn' type="submit" onClick={handleOnSignInBtn}>
                Sign In
            </Button>
            <p className={classes.newRegText}>New Registration?</p>
        </Box>
    );
}

export default Login;
