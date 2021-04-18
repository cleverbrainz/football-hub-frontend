import React, {useContext} from 'react';  
import { Route, Redirect, withRouter } from "react-router-dom";
import { CircularProgress } from '@material-ui/core'
import { AuthContext } from './context';
// import Loader from "../../Loader";

const AuthRouter = ({ locale, component: Component, ...rest }) => {

    const {user} = useContext(AuthContext);
    // console.log(user)
    // console.log(user.user)
    // console.log(!!user.checked)
    // console.log(locale)
    
    return ( 
        <Route
        {...rest}
            render={ (props) => (
                user.checked ? (
                    !!user.user ? (
                            <Component {...props}/>
                    ):(
                      <Redirect to={locale ? '/authentication' : '/login'} />
                    )
                ):(
                        <CircularProgress size={80} style={{ position: 'fixed', top: '50%', left: '50%' }} />
                )
            )}
        />
    );
}
export default withRouter(AuthRouter);