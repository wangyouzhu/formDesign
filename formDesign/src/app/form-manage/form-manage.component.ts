  import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Jsonp, Headers, RequestOptions } from '@angular/http';
import { UEditorComponent } from 'ngx-ueditor';
import { HttpClient } from '@angular/common/http';
import { NodeEvent, TreeModel, RenamableNode, Ng2TreeSettings, NodeMenuItemAction, MenuItemSelectedEvent } from 'ng2-tree';
import 'rxjs/add/operator/map';
import { NgSwitchCase } from '@angular/common/src/directives/ng_switch';
import { HttpDataService } from '../service/httpData.service';
import { InsertDataService } from '../service/insertData.service';
import { PageEditorComponent } from '../page-editor/page-editor.component';

declare const alertify: any;

const theTree: TreeModel = {

  value: '您好,看到这里..',
  id: 9999,
  settings: {
      cssClasses: {
        expanded: 'fa fa-caret-down',
        collapsed: 'fa fa-caret-right',
        empty: 'fa fa-caret-right disabled',
        leaf: 'fa'
      },
      templates: {
       /* node: '<i class="fa fa-folder-o pcTip"></i>',*/
        node: '<i class="fa fa-desktop"></i>',
        leaf: '<i class="fa fa-file-o"></i>'
      }
  },
  children: [
    {value: '就证明了..', id: 9999,settings: {
        cssClasses: {
          expanded: 'fa fa-caret-down',
          collapsed: 'fa fa-caret-right',
          empty: 'fa fa-caret-right disabled',
          leaf: 'fa'
        },
        templates: {
          node: '<i class="fa fa-mobile"></i>',
          leaf: '<i class="fa fa-file-o"></i>'
        }
      }, children: [
      {value: '你的树节点为空..', id: 9999}
    ]},
    {value: '所以我们显示这个提醒您 :)', id: 9999}
  ]

};

@Component({
  selector: 'app-form-manage',
  templateUrl: './form-manage.component.html',
  styleUrls: ['./form-manage.component.css']
})

export class FormManageComponent implements OnInit {
  isFolder: boolean; // 判断 添加的 是不是 文件夹

  node_id: number; // 节点的 Id
  tree_id: string; // 树Id
  node_name: string;  // 节点的 Name
  node_parentId: number;  // 节点的父 Id
  node_parentId2x: number;  // 节点的二级父 Id
  node_sore: number; // 节点的 排序
  newNode_sore: number; // 节点拖动后的 新排序
  node_level = 1; // 节点的 Level
  control_Url: string ;  // 根据不同的树，提供不同的接口。
  node_type=7; //7pc 端 fa-desktop  8手机端 fa-mobile
  settings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  headers = new Headers({ 'Content-type': 'application/json; charset=UTF-8' });
  options = new RequestOptions({ headers: this.headers });

  nodeMenuItem = [  // 配置 右键 按钮
    { action: NodeMenuItemAction.Custom, name: '新建PC网页', cssClass: 'fa fa-cog fa-desktop' },
    { action: NodeMenuItemAction.Custom, name: '新建手机页', cssClass: 'fa fa-cog fa-mobile' },
	{ action: NodeMenuItemAction.Custom, name: '导入页', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '-----------', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '配置节点', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '更新', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '下载站点', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '设为首页', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '设为PC页', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '设为手机页', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Custom, name: '-----------', cssClass: 'fa fa-cog' },
    { action: NodeMenuItemAction.Rename, name: '重命名', cssClass: 'rename' },
    { action: NodeMenuItemAction.Remove, name: '删除', cssClass: 'remove' }
    /*{ action: NodeMenuItemAction.Custom, name: '-----------', cssClass: 'fa fa-cog' }
    { action: NodeMenuItemAction.Custom, name: '新建项目', cssClass: 'fa fa-file-o' },
    { action: NodeMenuItemAction.NewTag, name: '新建文件', cssClass: 'fa fa-file-o' },
    { action: NodeMenuItemAction.NewFolder, name: '新建文件夹', cssClass: 'fa fa-folder-o' }*/
  ];

  tree = theTree;
  @ViewChild('treePages') public treePage;
  @ViewChild(PageEditorComponent) editor: PageEditorComponent;
  constructor(private http: Http, private httpData: HttpDataService, private insertData: InsertDataService) {
  }

  ngOnInit() {
    this.getTreeNode();
  }

  private ajax (method: string, dataObj?: object) {
    /*
     * 统一请求的接口
     *
     */
    let url: string,
        data: Object;
        if (method === 'add') {
          url = this.httpData.Manage_HOST + this.control_Url + '/addTreeNode';
          data = {
            'value': this.node_name,
            'node_level': this.node_level,
            'parent_id': this.node_parentId,
            'isFolder': this.isFolder
          };
        } else if (method === 'addProject') {
          url = this.httpData.Manage_HOST + this.control_Url + '/addTreeNode';
          data = {
            'value': this.node_name,
            'node_level': this.node_level,
            'parent_id': this.node_parentId,
            'isFolder': this.isFolder,
            'node_type': 1
          };
        }else if (method === 'addPage') {
          url = this.httpData.Manage_HOST + this.control_Url + '/addTreeNode';
          data = {
            'value': this.node_name,
            'node_level': this.node_level,
            'parent_id': this.node_parentId,
            'isFolder': this.isFolder,
            'node_type': this.node_type
          };
        } else if (method === 'removed') {
          url = this.httpData.Manage_HOST + this.control_Url + '/deleteTreeNode';
          data = dataObj;
        } else if (method === 'rename' || method === 'updataUrl') {
          url = this.httpData.Manage_HOST + this.control_Url + '/updateTreeNode';
          data = dataObj;
        } else if (method === 'setSite') {
          //http://1388w.cn:20890/nodeOperatorFacade/herdNodeOperatorFacade/ setSite  herdNodeOperatorFacade/ setSite
          url = this.httpData.Manage_HOST + 'herdNodeOperatorFacade/setSite';
          data = dataObj;
        } else if (method === 'changeNodetype') {
          url = this.httpData.Manage_HOST + 'herdNodeOperatorFacade/changeNodetype';
          data = dataObj;
        } else {
          url = this.httpData.Manage_HOST + this.control_Url + '/upTreeNode';
          data = {
            'id': this.node_id,
            'parent_id': this.node_parentId,
            'node_sore': this.node_sore,
            'node_sore1': this.newNode_sore
          };
        }

    this.http.post(url, JSON.stringify(data), this.options)
    .map(res => res.json())
    .subscribe((res) => {
      console.log(res);
      if ( method === 'rename' || method === 'add' || method === 'addProject' || method === 'addPage' ) {
          this.getTreeNode();
      }else if( method === 'setSite'){
        //localStorage.setItem("setSiteid",dataObj.node_id);
      }else if( method === 'changeNodetype'){
        //localStorage.setItem("setSiteid",dataObj.node_id);
        alert(res.msg);
      }
    });
  }

  private getTreeNode () {
    /*
     * 获取树形节点
     *
     */
    let url = 'nodeQueryFacade/getTreeNode';
    this.control_Url = 'nodeOperatorFacade';
    if ( window.location.search !== '' ) {
        if ( window.location.search.split('?')[1] === 'workbench' ) {
          this.control_Url = 'herdNodeOperatorFacade';
          url = 'herdNodeQueryFacade/getTreeNode';
        }
    }

    this.http.get(this.httpData.Manage_HOST + url)
   // this.http.get("http://192.168.0.117:20890/nodeQueryFacade/getTreeNode")
      .map(res => res.json())
      .subscribe((data) => {
        const nodes = data['msg'];
        if ( nodes.msg !== null ) {
            this.deleteChild(nodes.children);
            // 还有三个Settings在后端设置了, 1. 折叠 2. 样式 3. 图标(节点名称前的图标) fa-television
            // 具体 树形 还有什么设置的，可以参考 ng2-tree-master 源码进行参考..tablet
            nodes.settings.menuItems = this.nodeMenuItem;
          //nodes.settings.templates={node: '<i class="fa fa-tablet"></i> <i class="fa fa-sitemap"></i>'};
            this.tree = nodes;
            // console.log(this.tree)
        } else {
            alert(nodes.statusMsg);  // 报出错误信息
        }

      });
  }

  private deleteChildBak(obj: any) {
    /*
     * 用途：区分文件夹和文件
     * 操作：If 节点没有children 删除该字段
     */
      let length;
      obj.length === undefined ? length = 1 : length = obj.length;

      for ( let i = 0; i < length; i++ ) {
        let objChild;
        let isFirstFlag;
        obj[i] === undefined ? objChild = obj.children : objChild = obj[i].children;
        obj[i] === undefined ? isFirstFlag = true : isFirstFlag = false;

        if (objChild.length === 0) {
          isFirstFlag ? delete obj.children : delete obj[i].children;
        } else {
          this.deleteChildBak(objChild);
        }
      }
  }

  private deleteChild(obj: any) {
    /*
     * 判断传过来的 isFolder 是不是 为true
     * 不是则是 文件夹，删除isFolder
     *
     */
    if ( obj !== null ) {
        for (let i = 0; i < obj.length; i++) {
          if (!obj[i].isFolder) {
            delete obj[i].children;
          } else {
            if (obj[i].children.length > 0) {
              this.deleteChild(obj[i].children);
            }
          }
        }
    }
  }

  private onMenuItemSelected(e) {
    /*
     * 配置 Custom 的按钮的操作
     * 根据 name 的不一样，执行不同的操作
     */
    	const node = e.node.node;
      switch (e.selectedItem) {
        case '配置节点':
          const url = prompt('请输入您需要配置的Url', 'http://');
          node.url = url;
          this.ajax('updataUrl', node);
          break;

        case '新建项目':
          let projectName = prompt('请输入您的项目名称');
          if ( projectName !== null ) {
            if ( e.node.parent === null ) {
              this.node_level = 0;
            } else {
              this.findLevel(e.node.parent);
            }
            this.node_parentId = e.node.id;
            this.isFolder = true;
            this.node_name = projectName;
            this.ajax('addProject');
          } else {
            alert('一定要输入项目名称哦~');
          }
          break;
        case '新建PC网页':
          let pcName = prompt('请输入您的PC页面名');
          if ( pcName !== null ) {
            if ( e.node.parent === null ) {
              this.node_level = 0;
            } else {
              this.findLevel(e.node.parent);
            }
            this.node_parentId = e.node.id;
            this.isFolder = true;
            this.node_name = pcName;
            this.node_type = 7;
            this.ajax('addPage');
          } else {
            alert('一定要输入页面名哦~');
          }
          break;
        case '新建手机页':
          let mName = prompt('请输入您的手机页面名');
          if ( mName !== null ) {
            if ( e.node.parent === null ) {
              this.node_level = 0;
            } else {
              this.findLevel(e.node.parent);
            }
            this.node_parentId = e.node.id;
            this.isFolder = true;
            this.node_name = mName;
            this.node_type = 8;
            this.ajax('addPage');
          } else {
            alert('一定要输入页面名哦~');
          }
          break;
        case '更新':
          if(node.parent_id==3){
          	const url=this.httpData.Manage_HOST+'nodeOperatorFacade/updateNodeSite?nodeId='+node.id;
          	this.http.get(url)
				      .map(res => res.json())
				      .subscribe((data) => {
				        if ( data.status==0 ) {
				        	alert("更新完成");  // 报出错误信息
				        } else {
				          alert("目前站点没有内容哦...");  // 报出错误信息
				        }
				    });
          	//window.open(url,"下载站点");
          }else{
          	alert('一定要主节点才需要更新哦~');
          }
          break;
        case '下载站点':
          if(node.parent_id==3){
          	const url=this.httpData.Manage_HOST+'nodeOperatorFacade/packSite?nodeId='+node.id;
          	this.http.get(url)
				      .map(res => res.json())
				      .subscribe((data) => {
				        const nodes = data['msg'];
				        if ( nodes !== null ) {
				        	window.open(nodes,"下载站点");
				        } else {
				            alert("目前站点没有内容哦...");  // 报出错误信息
				        }
				    });
          }else{
          	alert('一定要主节点才能下载哦~');
          }
          break;
        case '设为首页':
          var type=node.node_type>7?0:1;
            const dataObj = {'node_id':node.id,'site_id':'6',"is_pc":type};
            console.log(dataObj);
            this.ajax('setSite', dataObj);
          break;
        case '设为PC页':
          const dataObjpc = {'node_id':node.id,"node_type":7};
          this.ajax('changeNodetype', dataObjpc);
          break;
        case '设为手机页':
          const dataObjiphone = {'node_id':node.id,"node_type":8};
          this.ajax('changeNodetype', dataObjiphone);
          break;
        default:
          break;
      }
  }

  private handleSelected($event) {
    /*
     * 树形点击选择操作
     *
     */
    this.node_id = $event.node.node.id;
    this.node_type = $event.node.node.node_type;
    this.node_name = $event.node.node.value;
    if ( $event.node.parent ) {
      $event.node.parent.parent !== null ? this.node_parentId2x = $event.node.parent.parent.id : this.node_parentId2x = $event.node.parent.id;
    } else {
      this.node_parentId2x = $event.node.id;
    }
    if ( $event.node.parent ) {
      this.node_parentId = $event.node.parent.node.id;
    }
    this.editor.changeEditor2(this.node_type==8);
    //this.editor.changeEditor();
    sessionStorage.setItem('editorcontent', '');
    this.insertData.insertData(this.node_id,this.node_type, this.editor.editor);
  }

  private handleCreated($event) {
    /*
     * 树形新建文件操作
     *
     */
    console.log($event);
    this.isFolder = $event.node._children !== null;
    this.node_parentId = $event.node.parent.node.id;
    this.node_name = $event.node.value;
    this.tree_id = $event.node.node.id;
    this.findLevel($event.node.parent);

    this.ajax('add');
  }

  private handleRemoved($event) {
    /*
     * 树形删除操作
     *
     */
    // console.log($event);
    const dataObj = $event.node.node;
    delete dataObj.createTime;
    delete dataObj.settings;
    console.log('removed stard');
    if($event.lastIndex!=0)console.log($event);
    console.log('removed end');
   // this.ajax('removed', dataObj);
  }

  private handleRenamed($event) {
    /*
     * 树形重命名操作
     *
     */
    const dataObj = $event.node.node;
    delete dataObj.createTime;
    delete dataObj.settings;
    this.ajax('rename', dataObj);
  }
  private handleSetSite($event) {
    /*
     * 树形重命名操作
     *
     */
    const dataObj = $event.node.node;
    delete dataObj.createTime;
    delete dataObj.settings;
    console.log(dataObj);
    this.ajax('setSite', dataObj);
  }

  private handleMoved($event) {
    /*
     * 树形移动节点操作
     * BUG. 暂时不能跨级拖动，他跨级拖动的时候会执行 remove 然后再 move，询问github作者没果，暂没解决办法
     */
     console.log("moved stard");
     console.log($event);
     console.log("moved end");
    /*this.node_id = $event.node.node.id;
    this.node_parentId = $event.node.parent.id;
    this.node_sore = $event.node.node.node_sore;
    this.newNode_sore = $event.node.positionInParent;
    this.ajax('moved');*/
    this.node_parentId = $event.node.parent.id;
    this.ajax('upTreeNode');
  }

  private findLevel (obj) {
    /*
     * 新建文件有用的，查找当前是第几层级。
     *
     */
    if (obj.parent === null) {
      this.node_level = this.node_level;
    } else {
      this.node_level++;
      this.findLevel(obj.parent);
    }
  }

}
