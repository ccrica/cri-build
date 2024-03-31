const options = {
    method: 'POST',
    headers: {
      cookie: 'LS-HEFMVBYLDJVGZNMS=f274863a035ababeb8d45262f40d0cff; LS-DXKIJUFRPCLIEKCU=292375d7e65142c1c466bc80115a6380; LS-FDLAPYAUETXKQQZE=51e18affaba22ff5ab3b2a758657de61',
      'Content-Type': 'application/json'
    },
    body: '{"method":"get_session_key","params":["dum_eed3","rkqw3gQu4P64"],"id":1}'
  };
  
  fetch('https://ls.dumspiro.ch/index.php?r=admin%2Fremotecontrol', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));