var Rebase = require('../../dist/bundle');
var firebase = require('firebase');
var React = require('react');
var ReactDOM = require('react-dom');
var config = require('../fixtures/config');
var dummyObjData = require('../fixtures/dummyObjData');

describe('removeBinding()', function(){
  var base;
  var ref;
  var testApp;
  var testEndpoint = 'test/removeBinding';

  beforeAll(() => {
    var mountNode = document.createElement('div');
    mountNode.setAttribute("id", "mount");
    document.body.appendChild(mountNode);
    testApp = firebase.initializeApp(config, 'DB_CHECK');
    ref = testApp.database().ref();
  });

  afterAll(done => {
    var mountNode = document.getElementById("mount");
    mountNode.parentNode.removeChild(mountNode);
    testApp.delete().then(done);
  });

  beforeEach(() => {
    base = Rebase.createClass(config);
  });

  afterEach(done => {
    base.delete().then(done);
  });

  it('should remove listeners set by the app', function(done){
    class TestComponent extends React.Component{
      constructor(props){
        super(props);
        this.state = {
          user: {}
        }
      }
      componentDidMount(){
        this.ref = base.bindToState(`${testEndpoint}`, {
          context: this,
          state: 'user'
        });
        base.removeBinding(this.ref);
        ref.child(`${testEndpoint}`).set({user: 'abcdef'}).then(() => {
          setTimeout(done, 500);
        })
      }
      componentDidUpdate(){
        done.fail('listener should have been removed');
      }
      render(){
        return (
          <div>
            No Data
          </div>
        );
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById("mount"));
  });

  it('should remove syncs set by the app', function(done){
    class TestComponent extends React.Component{
      constructor(props){
        super(props);
        this.state = {
          user: {}
        }
      }
      componentDidMount(){
        this.ref = base.syncState(`${testEndpoint}`, {
          context: this,
          state: 'user'
        });
        base.removeBinding(this.ref);
        ref.child(`${testEndpoint}`).set({user: 'abcdef'}).then(() => {
          setTimeout(done, 500);
        })
      }
      componentDidUpdate(){
        done.fail('Sync should have been removed');
      }
      render(){
        return (
          <div>
            No Data
          </div>
        );
      }
    }
    ReactDOM.render(<TestComponent />, document.getElementById("mount"));
  });

});
