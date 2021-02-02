import React, {useContext} from 'react';  
import { Route, Redirect, withRouter } from "react-router-dom";
import { AuthContext } from './context';
// import Loader from "../../Loader";

const AuthRouter = ({ children, ...rest }) => {

    const {user} = useContext(AuthContext);
    console.log(user)
    console.log(user.user)
    console.log(!!user.checked)
    
    return ( 
        <Route
        {...rest}
            render={ ({ location }) => (
                user.checked ? (
                    !!user.user ? (
                            // <h1>Hello</h1>
                            children
                    ):(
                        <Redirect to={'/login'} />
                    )
                ):(
                        // <Loader size="5x" text="Loading..."/>
                        // <h1>Loading!</h1>
                        <div></div>
                )
            )}
        />
    );
}
export default withRouter(AuthRouter);