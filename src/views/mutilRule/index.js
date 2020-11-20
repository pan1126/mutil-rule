import React from 'react';
import { Layout , Row, Col,Button,Select,Checkbox,message  } from 'antd';
import { Upload, Modal } from 'antd';
import DialogAlert from '../../component/modal'
import EditableTable from '../../component/ruleTable'
import "./index.scss"
const { Content } = Layout;
const { Option } = Select;

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}


function beforeUpload(file) {
    return new Promise((resolve, reject) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('请上传 JPG/PNG 格式图片!');
            return reject(false);
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('请上传 ≤ 2MB 以内的图片');
            return reject(false);
        }
        return resolve(true);
    })
}

export default class Mutilrule extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            itemList:[
                // {
                //     choseImg:false, //勾选规格图片
                //     choseShow:true,//展示在列表页
                //     luckList:[], //规格值列表数据
                //     choosableLuckList:[],//已选的规格值索引（多选）
                //     choseLucklist:[],/选中得规格值数据
                //     choseRule:'',/选中得规格名数据
                //     isShow:false,//规格图片是否展示--小程序
                //     ruleList:[],//规格名数据
                // }
            ],
            choosableRuleList:[-1,-1],//已选的规格名数据索引(单选)
            slecIndex:-1, //规格名选中索引(外层)
            luckIndex:-1, //规格值选中索引（外层）
            luckNameIndex:-1,//规格值选中索引(内层)
            previewVisible: false, // 图片触摸
            previewImage: '', //预览图片路径
            previewTitle: '', //标题
            visible:false,//排序弹框展示
        }
    }

    componentDidMount() {
        // console.log(this.props.match.params);
    }

    showItems(){  //点击展示规格分类
        let { itemList } = this.state
        if(itemList.length <2){
            let list = {
                ruleList:['房型','口味','重量','身高','爱好'],//规格名数据
                choseImg:false, //勾选规格图片
                choseShow:true,//展示在列表页
                luckList:[], //规格值列表数据
                choosableLuckList:[],//剩下可选的规格值数据（多选）
                isShow:false,//规格图片是否展示--小程序
                choseLucklist:[],//选择多个规格值列表数据
                choseRule:'',//选中得规格名数据
            }
            itemList.push(list)
            this.setState({
                itemList:itemList
            },()=>{
                // console.log(this.state.itemList)
            })
        }
    }

    onChange(value){ //规格名
        let { itemList,slecIndex,choosableRuleList } = this.state
        itemList[slecIndex].choseRule =itemList[slecIndex].ruleList[value]
        /// 预备接口请求规格名对应得规格值
        console.log(value)
        itemList[slecIndex].luckList = ['水电费','房租费','人工费']
        if(itemList[slecIndex].choseLucklist.length===0){
            itemList[slecIndex].choseLucklist.push({ 
                name:"",
                img:"",
                loading:false,
                fileList:[]
            });
        }
        choosableRuleList[slecIndex] = value
        this.setState({
            itemList:itemList,
            choosableRuleList:choosableRuleList
        },()=>{
            console.log(`选中规格名之后+++`)
            console.log(this.state.itemList)
        })
    }


    choseLuckonChange(value){ //规格值
        let { itemList,slecIndex,luckNameIndex } = this.state
        itemList[slecIndex].choseLucklist[luckNameIndex].name = itemList[slecIndex].luckList[value]
        itemList[slecIndex].choosableLuckList[luckNameIndex] = value
        itemList[slecIndex].choseLucklist.forEach((element,index) => {
            if(!element.name){
                itemList[slecIndex].choosableLuckList[index] = -1
            }
        });
        this.setState({
            itemList:itemList
        },()=>{
            console.log(this.state.itemList)
        })
    }

    onSearch(value){
        let { itemList,slecIndex } = this.state
        if(value!==''){
            console.log(itemList)
            console.log(slecIndex)
            itemList[slecIndex].choseRule = value

            /// 预备接口请求规格名对应得规格值
            itemList[slecIndex].luckList = ['水电费','房租费','人工费']
            let obj = {
                name:"",
                img:"",
                loading:false,
                fileList:[]
            }
            itemList[slecIndex].choseLucklist.push(obj)
            this.setState({
                itemList:itemList
            },()=>{
                // console.log(`搜索规格名之后+++`)
                // console.log(this.state.itemList)
            })
        }
        //console.log('search:', value);
    }
    
    setHover(type,index){
        if(type){
            this.setState({
                slecIndex:index
            })
        }else{
            this.setState({
                slecIndex:-1
            })
        }
    }

    getSetHover(index){
        this.setState({
            slecIndex:index
        })
    }

    getlucyHover(index,index1){
        this.setState({
            luckNameIndex:index,
            luckIndex:index1
        })
    }

    //勾选图片
    onChoseImg(e){ 
        let { itemList } = this.state
        itemList[0].choseImg = e.target.checked
        if(e.target.checked){
            itemList[0].choseShow = e.target.checked
        }
        this.setState({
            itemList:itemList
        },()=>{
        //    console.log('勾选图片后 ') 
        //    console.log(this.state.itemList)
        })
    }

    //勾选展示
    onChoseShowT(e){ 
        console.log(e)
        let { itemList } = this.state
        itemList[0].choseShow = e.target.checked
        this.setState({
            itemList:itemList
        },()=>{
            // console.log('勾选展示数据后 ') 
            // console.log(this.state.itemList)
        })
    }

    deItemSlect(e){ 
        let index = e.currentTarget.getAttribute("data-index")
        let { itemList } = this.state
        itemList.splice(index,1)
        this.setState({
            itemList:itemList
        },()=>{
            console.log('删除规格名后的')
            console.log(this.state.itemList)
        })
    }

    deleteLuckItems(index,index1){
        let { itemList } = this.state
        itemList[index].choseLucklist.splice(index1,1)
        itemList[index].choosableLuckList.splice(index1,1)
        this.setState({
            itemList:itemList
        },()=>{
            console.log('删除规格值后的')
            console.log(this.state.itemList)
        })
    }

    lucyHover(type,index,index1){
        // console.log('规格值触摸')
        // console.log(index)
        if(type){
            this.setState({
                luckNameIndex:index,
                luckIndex:index1
            })
        }else{
            this.setState({
                luckNameIndex:-1,
                luckIndex:-1
            })
        }
    }

    //添加规格值
    addSku(e){
        let { itemList }  =this.state
        let index = e //外部索引
        let luckList = itemList[index].luckList
        if(itemList[index]['choseLucklist'].length<=10 && itemList[index]['choseLucklist'].length<=luckList.length){
            let obj = {
                name:"",
                img:"",
                loading:false,
                fileList:[]
            }
            itemList[index].choseLucklist.push(obj)
            this.setState({
                itemList:itemList
            },()=>{
                console.log(this.state.itemList)
            })
        }
    }

    //上传图片~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    handleCancel(){this.setState({ previewVisible: false })};


    async handlePreview (file) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
          this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
          });
    };

    handleChange (info,index) {
        // console.log(info)
        let { itemList } = this.state
        let { file,fileList } = info
        if (file.status === 'uploading') {
            itemList[0].choseLucklist[index].loading = true
            itemList[0].choseLucklist[index].img = ""
        }
        if (file.status === 'done') {
            itemList[0].choseLucklist[index].img = file.response.url || ""
            itemList[0].choseLucklist[index].loading = false
        }else if(file.status === 'error'){
            fileList = []
            itemList[0].choseLucklist[index].img = ""
            itemList[0].choseLucklist[index].loading = false
            message.error('上传失败！');
        }else if(file.status==="removed"){
            itemList[0].choseLucklist[index].img = ""
            itemList[0].choseLucklist[index].loading = false
        }
        itemList[0].choseLucklist[index].fileList = fileList
        this.setState({
            itemList:[...itemList],
        },()=>{
            console.log(`上传图片之后+++`)
            console.log(this.state.itemList)
        })
      };

      //排序弹框
      sortOrder(){
        let { itemList } = this.state
        DialogAlert.open({
            visible:true,
            title:'拖动规格值进行排序',
            itemList:itemList,
            cancelCallbackFn:()=>{
              //取消想做的操作
            },
            confirmCallbackFn:(data)=>{
                this.setState({
                    itemList:data
                },()=>{
                    console.log('排序弹框--确认之后')
                    console.log(this.state.itemList)
                })
            }
        })
      }

    render() {
        let { slecIndex,itemList,choosableRuleList,previewVisible,previewImage, previewTitle,luckNameIndex,luckIndex } = this.state
        const uploadButton = (
            <div style={{width:'100%',height:'100%'}}>
              <div className="upload-img-wrap upload-img-wrap-error">
                  <div className="arrow arrow-error"></div>
                    <div className="rc-upload">
                        <div className="rc-upload-trigger">
                            <i>+</i>
                        </div>
                        <p className="rc-upload-tips"></p>
                    </div>
                </div>
            </div>
          );
        return (
            <Content
                className="site-layout-background mutilrule"
                style={{
                margin: '16px 16px',
                padding: 16,
                minHeight: 280,
                minWidth:750
                }}>
                <Row>
                    <Col span={24}>
                        <div className="tip font-w">基本信息</div>
                    </Col>
                </Row>
                <div className="container">
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">商品名称：</div>
                            </Col>
                            <Col flex="auto">
                                <div className="item-b alLeft">我真立马的</div>
                            </Col>
                        </Row>
                    </div>
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">商品分类：</div>
                            </Col>
                            <Col flex="auto">
                                <div className="item-b alLeft">二了吧唧</div>
                            </Col>
                        </Row>
                    </div>
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">外卖SKU：</div>
                            </Col>
                            <Col flex="auto">
                                <div className="item-b alLeft">ZH123465</div>
                            </Col>
                        </Row>
                    </div>
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">POS SKU：</div>
                            </Col>
                            <Col flex="auto">
                                <div className="item-b alLeft">1615800</div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Row>
                    <Col span={24}>
                        <div className="tip font-w">价格库存</div>
                    </Col>
                </Row>
                <div className="container">
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">前端设置规格：</div>
                            </Col>
                            <Content
                                className="rulebox"
                                style={{
                                  minHeight: 70,
                                  minWidth:638
                                }}
                            >
                                {
                                    itemList.length>0 && itemList.map((item,index)=>{
                                        return  (<div className="rc-sku-group"
                                        data-index={index}
                                        onMouseEnter={this.setHover.bind(this,true,index)}
                                        onMouseLeave={this.setHover.bind(this,false,index)}
                                        onClick={this.getSetHover.bind(this,index)}
                                        key={'ite'+index}
                                    >
                                        <h3 className="group-title">
                                            <span className="group-title__label">规格名：</span>
                                            <Select
                                                    placeholder="请选择"
                                                    showSearch
                                                    style={{ width: 94 }}
                                                    optionFilterProp="children"
                                                    onChange={this.onChange.bind(this)}
                                                    onFocus={this.onFocus}
                                                    onBlur={this.onBlur}
                                                    value={item.choseRule || '请选择'}
                                                    onSearch={this.onSearch}
                                                    filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        item.ruleList.length >0 && item.ruleList.map((ruleItem,ruleIndex)=>{
                                                            if(choosableRuleList.indexOf(ruleIndex)===-1){
                                                                return (
                                                                    <Option key={'rule'+ruleIndex} value={ruleIndex}>{ruleItem}</Option>
                                                                )
                                                            }
                                                        })
                                                    } 
                                            </Select>
                                            {
                                                (index ===0 && item.choseRule!=='') &&
                                                <div className="sku-image-wrapper">
                                                    <Checkbox checked={item.choseImg} onChange={this.onChoseImg}>添加规格图片</Checkbox>
                                                    {
                                                        item.choseImg && 
                                                        <Checkbox checked={item.choseShow} onChange={this.onChoseShowT}>规格图片展示在规格选择页</Checkbox>
                                                    }
                                                </div>
                                            }
                                            {
                                                slecIndex === index &&
                                                <span data-index={index} onClick={this.deItemSlect.bind(this)} className="group-remove">×</span>
                                            }
                                        </h3>
                                        <div className="group-container">
                                            <span className="sku-list__label">规格值：</span>
                                            <div className="sku-list">
                                                {
                                                   item.choseLucklist.length >0 && item.choseLucklist.map((item1,index1)=>{
                                                        return(
                                                            <div className={`rc-sku-item ${item.choseImg?'active':''}`} 
                                                            onMouseEnter={this.lucyHover.bind(this,true,index1,index)}
                                                            onMouseLeave={this.lucyHover.bind(this,false,index1,index)}
                                                            onClick={this.getlucyHover.bind(this,index1,index)}
                                                            key={'opo'+index1}>
                                                                <div className="zent-popover-wrapper zent-select" data-zv="8.5.2" style={{display: 'inline-block'}}>
                                                                    <Select placeholder="请选择"
                                                                      onChange={this.choseLuckonChange.bind(this)}
                                                                      value={item1.name || '请选择'}
                                                                      style={{ width: 170 }}>
                                                                       {
                                                                           item.luckList.length>0 && item.luckList.map((luckItems,indexs)=>{
                                                                               if(item.choosableLuckList.indexOf(indexs)===-1){
                                                                                    return(
                                                                                        <Option
                                                                                            key={'luck'+indexs}
                                                                                            value={indexs}
                                                                                        >{luckItems}</Option>
                                                                                    )
                                                                               }
                                                                           })
                                                                       }
                                                                    </Select>
                                                                </div>
                                                                {
                                                                    (index1 === luckNameIndex && luckIndex === index) &&
                                                                    <span onClick={this.deleteLuckItems.bind(this,index,index1)} className="item-remove small">×</span>
                                                                }
                                                                {
                                                                    item.choseImg && 
                                                                    <div className="clearfix">
                                                                        <Upload
                                                                            name="avatar"
                                                                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                                            listType="picture-card"
                                                                            onPreview={(value)=>{this.handlePreview(value,index1).bind(this)}}
                                                                            onChange={(value)=>{this.handleChange(value,index1).bind(this)}}
                                                                            fileList={item1.fileList}
                                                                            beforeUpload={beforeUpload}
                                                                            >
                                                                            {(item1.img !== "" || item1.loading) ? null :uploadButton}
                                                                        </Upload>
                                                                        <Modal
                                                                                visible={previewVisible}
                                                                                title={previewTitle}
                                                                                footer={null}
                                                                                onCancel={this.handleCancel}
                                                                            >
                                                                                {
                                                                                    item1.img !=="" && <img alt={item1.name} style={{ width: '100%' }} src={previewImage} />
                                                                                }
                                                                            
                                                                        </Modal>
                                                                        {
                                                                            item1.img ==="" && <div className="img-required-error">请添加规格图片</div>
                                                                        }
                                                                </div>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    item.luckList.length<=10 && item.luckList.length>0 && item.choseLucklist.length<item.luckList.length &&
                                                    <p className="sku-add goods-edit-link" onClick={this.addSku.bind(this,index)}>添加规格值</p>
                                                }
                                            </div>
                                        </div>
                                        {
                                            (item.choseImg && item.choseLucklist.length>0) &&   
                                            <div className="sku-group-cont"><p className="help-block">仅支持为第一组规格设置规格图片（最多40张图），买家选择不同规格会看到对应规格图片，建议尺寸：800 x 800像素</p></div>
                                        }
                                        <div className="sku-group-cont"></div>
                                    </div>)
                                    })
                                }
                                <div className="rc-sku-group">
                                    <h3 className="group-title">
                                        {
                                            itemList.length<2 &&
                                            <Button type="button" onClick={this.showItems.bind(this)} data-zv="8.5.2" className="zent-btn">
                                                <span data-zv="8.5.2">添加规格项目</span>
                                            </Button>
                                        }
                                        {
                                            itemList.length>=1 &&
                                            <p className="goods-edit-link" onClick={this.sortOrder.bind(this)}>自定义排序</p>
                                        }
                                    </h3>
                                </div>
                            </Content>
                        </Row>
                    </div>
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">规格明细：</div>
                            </Col>
                            <Content
                                className="rulebox"
                                style={{
                                  minHeight: 70,
                                  minWidth:638
                                }}
                            >
                                <EditableTable />
                            </Content>
                        </Row>
                    </div>
                </div>
                <Row>
                    <Col span={24}>
                        <div className="tip font-w">其他信息</div>
                    </Col>
                </Row>
                <div className="container">
                    <div className="mart24">
                        <Row>
                            <Col flex="112px">
                                <div className="item-b aRight">商品描述：</div>
                            </Col>
                            <Col flex="auto">
                                <div className="item-b alLeft">1615800</div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content>
        )
    }
}