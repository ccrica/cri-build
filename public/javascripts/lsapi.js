import dotenv from 'dotenv';
import fetch from 'node-fetch';

const result = dotenv.config({ path: '/var_env/ls/.env' });
if (result.error) {
  throw result.error;
}
const options = {
        method: 'POST',
        headers: {
            cookie: 'LS-HEFMVBYLDJVGZNMS=f274863a035ababeb8d45262f40d0cff; LS-DXKIJUFRPCLIEKCU=292375d7e65142c1c466bc80115a6380; LS-FDLAPYAUETXKQQZE=51e18affaba22ff5ab3b2a758657de61',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            method: "get_session_key",
            params: [process.env.LS_API_USER, process.env.LS_API_PWD],
            id: 1
        })
};

fetch('https://ls.dumspiro.ch/index.php?r=admin%2Fremotecontrol', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));


//        const fetch = require('node-fetch');

        // let url = 'https://ls.dumspiro.ch/index.php?r=admin%2Fremotecontrol';
        
        // let options = {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     cookie: 'LS-FDLAPYAUETXKQQZE=50bb6a4327130ba1621f809d893cafe6; '
        //   },
        //   body: '{"method":"export_responses","params":["fw0QnCqaP1u0aFdbZMjupMkbtuqZM87b","983971","csv",null,"all"],"id":1}'
        // };
        
        // fetch(url, options)
        //   .then(res => res.json())
        //   .then(json => console.log(json))
        //   .catch(err => console.error('error:' + err));