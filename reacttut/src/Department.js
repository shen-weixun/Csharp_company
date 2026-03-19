import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import {Button,ButtonToolbar} from 'react-bootstrap';
import {AddDepModal} from './AddDepModal';
import {EditDepModal} from './EditDepModal';
export class Department extends Component {
  constructor(props){
    super(props);
    this.state={deps:[],addModalShow:false,editModalShow:false};
  }
  refrshList(){
    fetch(process.env.REACT_APP_API_URL+'department/')
    .then(response => {
      if(!response.ok) throw new Error("網路回應不正確");
      return response.json();
    })
    .then(data=>{
      this.setState({deps:data});
    });
  }
    componentDidMount(){
      this.refrshList();
    }
    componentDidUpdate(){
      this.refrshList();
    }
  deleteDep(depid){
    if(window.confirm('Are you sure?')){
      fetch(process.env.REACT_APP_API_URL+'department/'+depid,{
        method:'DELETE',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'}
      })
  }
}
   render(){
    const {deps,depid,depname}=this.state;
    let addModalClose=()=>this.setState({addModalShow:false});
    let editModalClose=()=>this.setState({editModalShow:false});
    return(
      <div >
        <Table className="mt-4" striped bordered hover size="sm">
           <thead>
            <tr>
             <th>DepartmentId</th>
             <th>DepartmentName</th>
             <th>Options</th>
            </tr>
           </thead>
            <tbody>
              {deps.map(dep=>
                <tr key={dep.DepartmentId}>
                   <td>{dep.DepartmentId}</td>
                   <td>{dep.DepartmentName}</td>
                   <td>
                      <ButtonToolbar>
                         <Button className="mr-2" variant="info"
                          onClick={()=>this.setState({editModalShow:true,
                          depid:dep.DepartmentId,
                          depname:dep.DepartmentName})}>
                          Edit
                         </Button>

                         <Button className="mr-2" variant="danger"
                          onClick={()=>this.deleteDep(dep.DepartmentId)}>
                          Delete
                         </Button>

                         <EditDepModal show={this.state.editModalShow} onHide={editModalClose}
                          depid={depid}
                          depname={depname}/>
                      </ButtonToolbar>
                   </td>
                </tr>
              )}
            </tbody>
        </Table>

        <ButtonToolbar>
          <Button variant="primary" onClick={()=>this.setState({addModalShow:true})}>
           AddDepartment
          </Button>

          <AddDepModal show={this.state.addModalShow} onHide={addModalClose}/>
        </ButtonToolbar>
      </div>
    )
   }
}