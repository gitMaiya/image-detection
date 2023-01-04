window.process = {};
import Navigation from './component/navigation/navigation';
import Clarifai from 'clarifai';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/imageLinkForm/imageLinkForm';
import Rank from './component/rank/rank';
import './App.css';
import SignIn from './component/sign-in/signIn';
import Register from './component/register/register';
import ParticlesBg from 'particles-bg';
import React,{ Component } from 'react';
import FaceRecognition from './component/FaceRecognition/face-recognition';

const app = new Clarifai.App({
  apiKey: '6dc7e46bc9124c5c8824be4822abe105'
});




class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '', 
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:  {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }

    }
  }
// in order to communicate with the back end we can use fetch 
// componentDidMount() {
//   fetch('http://localhost:3000/')
//   .then(response => response.json())
//   .then(console.log)
// }

 loadUser = (data) => {
  this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
  }})
 }

 calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width -(clarifaiFace.right_col * width),
    bottomRow : height - (clarifaiFace.bottom_row * height)
  }
 }

 displayFaceBox = (box) => {
  this.setState({box : box});

 }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    //imageurl should get displayed when we click on submit 
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
         .then(response => response.json())
         .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
     .catch(err => console.log(err));
    }
    
      



  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});

  }

  render() {
   return (
    <div className="App">
      <ParticlesBg type="circle" bg={true} />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      {this.state.route === 'home' ?
        <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> 
       </div> :
         (
          this.state.route === 'signin' ?
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> :
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
         )
        
       
        }
      
      
    </div>
  );
  }
}

export default App;
