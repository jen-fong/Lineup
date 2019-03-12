import React from 'react'
import NavBar from './components/nav/NavBar.jsx'
import Main from './components/Main.jsx'

class App extends React.Component {
  render () {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <NavBar />
          <Main />
        </div>
      </div>
    )
  }
}

export default App
