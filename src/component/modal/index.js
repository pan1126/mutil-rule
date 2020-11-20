import React from 'react';
import { Modal } from 'antd';
import ReactDOM from 'react-dom';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import './index.scss'


class DialogBox extends React.Component {
    //构造方法
    static defaultProps ={
       
    }
    constructor(props){
        super(props);
        this.state = {
            items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            visible:false,
            itemList:[],
            newItemList:[],
            title:'拖动排序',
            okText:'确认',
            cancelText:'取消',
            confirmLoading:false,
            cancelCallbackFn:function(){}, //取消 回调函数
            confirmCallbackFn:function (){}//确认 回调函数
        }
    }

    open = (options) => { //打开
        let itemList = options.itemList || [] 
        if(itemList.length>0){
            let newItemList = []
            for(var index=0;index<itemList.length;index++){
                newItemList[index] = itemList[index]
                if(!itemList[index].choseRule){
                    newItemList.splice(index,1)
                    itemList[index].choosableLuckList = []
                }else{
                    newItemList[index].choseLucklist = itemList[index].choseLucklist.filter((item) => {
                        return item.name !== ""
                    })
                    newItemList[index].choosableLuckList = itemList[index].choosableLuckList.filter((item) => {
                        return item !== -1
                    })
                    if(newItemList[index].choseLucklist.length===0){
                        newItemList.splice(index,1)
                    }
                }
            }
            options.newItemList = newItemList[0] ? newItemList : []
        }
        this.setState({
            ...options
        },()=>{
           console.log(this.state.newItemList)
        })
    }


    handleOk = () => {  //确认
        let itemList = this.state.itemList
        this.setState({
            confirmLoading: true,
        })
        setTimeout(() => {
            this.setState({
              visible: false,
              confirmLoading: false,
            },()=>{
                this.state.confirmCallbackFn(itemList)
            })
          }, 800);
      }
  
      handleCancel = () =>{  //关闭
        this.setState({
            visible:false
        },()=>{
            this.state.cancelCallbackFn()
        })
    }
    onSortEnd = (oldIndex, newIndex,index) => {
        let newItemList = this.state.newItemList
        newItemList[index].choseLucklist = arrayMove(newItemList[index].choseLucklist, oldIndex, newIndex)
        this.setState({
            newItemList: newItemList,
        },()=>{
            console.log('滚动之后排序')
            console.log(this.state.newItemList)
        })
    }
 
    render(){
        let { confirmLoading,visible,title,okText,cancelText,newItemList} = this.state
        const SortableItem = SortableElement(({value}) => <span className="item"><i>{value.name}</i></span>);
        const SortableList = SortableContainer(({items}) => {
          return (
            <div>
              {items.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value}/>
              ))}
            </div>
          );
        });
        return (
            <Modal
                    title={title}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText={okText}
                    cancelText={cancelText}
                >
                <div className="dialogalert">
                    {
                        newItemList.length>0 ? newItemList.map((item,index)=>{
                            return (
                                <div className="sku-sortable-group" key={`itlist-${index}`}>
                                    <div className="sku-sortable-group__title">{item.choseRule}：</div>
                                    <div className="sku-sortable-group__content">
                                        <div className="sku-sortable-items">
                                            <div className="zent-sortable" data-zv="8.5.2">
                                                <SortableList axis="x" items={item.choseLucklist} onSortEnd={(({oldIndex, newIndex})=> this.onSortEnd(oldIndex,newIndex,index))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <p>无可拖拽的商品规格~</p>
                    }
                </div>
            </Modal>
        );
    }
 
}

let div = document.createElement('div');
document.body.appendChild(div);
let DialogAlert = ReactDOM.render(<DialogBox /> ,div); //返回实例
 
export default DialogAlert;
