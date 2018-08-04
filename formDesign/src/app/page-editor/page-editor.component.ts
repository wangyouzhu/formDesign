import { HttpDataService } from './../service/httpData.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UEditorComponent } from 'ngx-ueditor';
import { FormManageComponent } from '../form-manage/form-manage.component';
import { InsertDataService } from '../service/insertData.service';
import * as $ from 'jquery';

declare const UE: any;

@Component({
  selector: 'app-page-editor',
  templateUrl: './page-editor.component.html',
  styleUrls: ['./page-editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PageEditorComponent {
    @ViewChild(UEditorComponent) editor: UEditorComponent;
    @Input() nodeId: number;
    @Input() nodeType: number;
    @Input() nodeName: string;
    @Input() nodeParentId: number;
    @Input() nodeParentId2x: number;

    toggle = true;
    toggleValue = '隐藏';
    toggleVersion = true;
    versionEditor = '手机';
    nowSelect = 'iphone6p';
    lastSelect = 'iphone6p';
    swPluginTool=true;

    headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8' });
    options = new RequestOptions({ headers: this.headers });

    custom: any = {
        // 配置工具栏
        iframeCssUrl: './assets/ueditor/formdesign/self/css/style.css', // 给编辑器内部引入一个css文件
        allowDivTransToP: false,      // 允许进入编辑器的div标签自动变成p标签
        initialFrameWidth: 'auto' ,  // 初始化编辑器宽度,默认1000
        initialFrameHeight: 500,  // 初始化编辑器高度,默认320
        enableAutoSave: false, //启用自动保存
        saveInterval: 0 //自动保存间隔时间， 单位ms
    };
    constructor(private el: ElementRef, private http: Http, private httpData: HttpDataService, private insertData: InsertDataService) {
      sessionStorage.setItem('editorStyle', 'pc');
      /*console.log(this.nodeType);*/
       if(this.nodeType==7){
         sessionStorage.setItem('editorStyle', 'pc');
       }else{
         sessionStorage.setItem('editorStyle', 'phone');
       }
    }

    onPreReady(comp: UEditorComponent) {
        /*
         * 在百度编辑器里面添加小按钮
         *
         */

        // 表单设计器
        UE.registerUI('button_active', function(editor, uiName){

            // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
            editor.registerCommand(uiName, {
                execCommand: function(){
                    editor.execCommand('activewidget');
                }
            });
            // 创建一个button
            const btn = new UE.ui.Button({
                // 按钮的名字
                name: uiName,
                // 提示
                title: '表单设计器 ',
                // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                cssRules : 'background-position: -401px -40px;',
                // 点击时执行的命令
                onclick: function () {
                    // 这里可以不用执行命令,做你自己的操作也可
                   editor.execCommand(uiName);
                }
            });

            // 因为你是添加button,所以需要返回这个button
            return btn;
        });

        // 预览按钮
        UE.registerUI('button_preview', function(editor, uiName){

            // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
            editor.registerCommand(uiName, {
                execCommand: function(){
                    try {
                        editor.execCommand('preview');
                    } catch ( e ) {
                        alert('预览异常');
                    }
                }
            });
            // 创建一个button
            const btn = new UE.ui.Button({
                // 按钮的名字
                name: uiName,
                // 提示
                title: '预览',
                // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                cssRules : 'background-position: -420px -19px;',
                // 点击时执行的命令
                onclick: function () {
                    // 这里可以不用执行命令,做你自己的操作也可
                   editor.execCommand(uiName);
                }
            });

            // 因为你是添加button,所以需要返回这个button
            return btn;
        });

        // 保存按钮
        UE.registerUI('button_save', function(editor, uiName){

            // 注册按钮执行时的command命令，使用命令默认就会带有回退操作
            editor.registerCommand(uiName, {
                execCommand: function(){
                    try {
                        editor.execCommand('save');
                    } catch ( e ) {
                        alert('保存异常');
                    }
                }
            });
            // 创建一个button
            const btn = new UE.ui.Button({
                // 按钮的名字
                name: uiName,
                // 提示
                title: '保存表单',
                // 需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                cssRules: 'background-position: -481px -20px;',
                // 点击时执行的命令
                onclick: function () {
                    // 这里可以不用执行命令,做你自己的操作也可
                   editor.execCommand(uiName);
                }
            });

            // 因为你是添加button,所以需要返回这个button
            return btn;
        });
    }

    exec(data: any) {
        /*
         * 执行 page-editor 模块的方法，实现点击按钮的操作
         *
         */
        this.editor.Instance.execCommand(data);
    }
    setHtml(){
      var html="";
      this.editor.Instance.setContent(html);
    }
    setGlc(){
      var html=`<input name="leipiNewField" type="text" title="管理条控件" value="管理 - 控件" leipiplugins="glc" nodeid="`+this.nodeId+`" classname="`+this.nodeName+`" style="width: 80px;height: 30px;">`;
      this.editor.Instance.setContent(html,true);
    }
    setMyPlugins(tag){
      var html="";
      switch (tag){
        case "wxgrouptag":
          html=`<input name="leipiNewField" type="text" title="微信分组标签" value="微信分组标签" leipiplugins="wxgrouptag" style="width: 90px;height: 30px;">`;
          break;
      }
      if(html!='')this.editor.Instance.setContent(html,true);
    }

    public setContent(content: string) {
        /*
         * 执行 page-editor 模块的方法，插入用户模板内容
         *
         */
        this.editor.Instance.setContent(content);
    }

    toggleShow() {
        /*
         * 隐藏/显示 编辑器 - 点击按钮
         *
         */
        this.toggle ? this.editor.Instance.setHide() : this.editor.Instance.setShow();
        this.toggle ? this.toggleValue = '显示' : this.toggleValue = '隐藏';
        this.toggle = !this.toggle;
    }

    changeEditor() {
        /*
         * 手机/电脑版编辑 - 点击按钮
         *
         */
        let saveConfirm = true;
        if ( this.editor.Instance.hasContents() ) {
            saveConfirm = confirm('请确认是否已经保存数据！');
        }

        if ( saveConfirm ) {
            this.toggleVersion ? this.versionEditor = '电脑' : this.versionEditor = '手机';
            this.toggleVersion = !this.toggleVersion;
            sessionStorage.setItem('editorcontent', this.editor.Instance.getContent());
        }

        if ( !this.toggleVersion ) {
            sessionStorage.setItem('editorStyle', 'phone');
            $('.ueditor-textarea.edui-default').addClass('phone').addClass(this.nowSelect);
        } else {
            sessionStorage.setItem('editorStyle', 'pc');
            $('.ueditor-textarea.edui-default').removeClass('phone').removeClass(this.lastSelect);
        }

        if ( this.nodeId !== undefined ) {
            this.insertData.insertData(this.nodeId,this.nodeId, this.editor);
        }
    }

  changeEditor2(type) {
    this.toggleVersion=!type;
    this.toggleVersion ? this.versionEditor = '电脑' : this.versionEditor = '手机';

    if ( !this.toggleVersion ) {
      sessionStorage.setItem('editorStyle', 'phone');
      $('.ueditor-textarea.edui-default').addClass('phone').addClass(this.nowSelect);
    } else {
      sessionStorage.setItem('editorStyle', 'pc');
      $('.ueditor-textarea.edui-default').removeClass('phone').removeClass(this.lastSelect);
    }
  }

    phoneChange (e) {
        /*
         * 手机版编辑 - 选择不同的手机屏幕功能
         *
         */
        this.lastSelect = this.nowSelect;
        this.nowSelect = e.target.value;
        $('.ueditor-textarea.edui-default').addClass(this.nowSelect).removeClass(this.lastSelect);
    }

		getText() {
			console.log(this.editor.Instance.selection.getRange().cloneContents())
		}
		setPluginTool(b){
			this.swPluginTool=b;
		}
}

