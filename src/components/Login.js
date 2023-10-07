import {GoogleLogin} from 'react-google-login'

const CLIENT_ID = "16422091894-2aisb9q5f0qp4mc4u4v9di97hks1u0l8.apps.googleusercontent.com"

function onSuccess(res) {
    console.log("Login success. user: ", res.profileObj)
}

function onFailure(res) {
    console.log("Login failed. err: ", res)
}

function Login() {
    return (
        <div>
            <GoogleLogin
                clientId={CLIENT_ID}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy='single_host_origin'
                isSignedIn={true}
                buttonText = {"Google Drive Login"}
             />
        </div>
    )
}

export default Login;
