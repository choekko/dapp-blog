import React, { Component } from "react";
import TipManagerInstance from "./contracts/TipManager.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3:null, 
      accounts: null, 
      contract: null, 
      totalPostCount:0, 
      posts:[],
      loading: false,
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TipManagerInstance.networks[networkId];
      const instance = new web3.eth.Contract(
        TipManagerInstance.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getPost);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getPost = async() => {
    const { contract } = this.state;
    const totalPostCount = await contract.methods.totalPostCount().call();

    const posts = [];

    for (let i = 1; i<=totalPostCount;i++){
      const post = await contract.methods.postList(i).call();
      posts.push(post);
    }

    this.setState({totalPostCount, posts});
  }

  contractManager = {
    writePost: async(title, description) => {
      const writePostContractFunc = async() => {
        const { accounts, contract,posts } = this.state;
        const result = await contract.methods.writePost(
          title,
          description
        ).send({from:accounts[0]});
        const postCreated = result.events.PostCreated.returnValues;
        this.setState({posts:[postCreated,...posts]});
      }
      await this.sendContract(writePostContractFunc);
    },
    giveTip: async(postId) => {
      const giveTipContractFunc = async () => {
        const { accounts, contract } = this.state;
        const amount = prompt("얼마 기부하실? (단위는 WEI ETH)");
        if(!amount){
          alert("기부가 취소되었습니다.")
          return
        }
        const amountNum = Number(amount)
        if(!amountNum) {
          alert("올바른 값을 넣어주세요.")
          return
        }
        await contract.methods.giveTip(postId)
        .send({from: accounts[0], value: amountNum})
      }
      await this.sendContract(giveTipContractFunc);
    }
  }

  sendContract = async (contractFunc) => {
    this.setState({loading:true})
    try{
      const result = await contractFunc();
      this.setState({loading:false});
    } catch(err){
      if(err.code === 4001){
        this.setState({loading:false});
      }
      alert(err.message)
    }
  }

  onSubmitPost = async (e) => {
    e.preventDefault();
    const {title, description} = e.target;
    await this.contractManager.writePost(title.value,description.value);
  }

  onClickGiveTip = async(e) => {
    e.preventDefault();
    const postId = e.target.dataset.id
    await this.contractManager.giveTip(postId);
  }

  render() {
    const {web3,posts, loading} = this.state;
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    } else if(loading){
      return <div>loading... waiting for the contract end</div>
    }
    return (
      <div className="App">
        <h1>유섭아 가즈앗</h1>
        <form onSubmit={this.onSubmitPost}>
          <input 
            type="text" 
            name="title"
            placeholder="title"/>
          <input 
            type="text" 
            name="description"
            placeholder="description"/>
          <input type="submit"/>
        </form>
        {posts.map((post) => {
          const {
            description,
            id,
            owner,
            tipAmount,
            title
          } = post;
          return (
            <div key={id}>
              <h3>title: {title}</h3>
              <h6>description: {description}</h6>
              <h6>author: {owner}</h6>
              <h6>tipAmount: {tipAmount}</h6>
              <div 
                onClick={this.onClickGiveTip}
                data-id={id}
              >기부 버튼!!</div>
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;
