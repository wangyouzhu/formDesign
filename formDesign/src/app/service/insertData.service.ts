import { Headers, Http, RequestOptions } from '@angular/http';
import { HttpDataService } from './httpData.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as $ from 'jquery';

@Injectable()
export class InsertDataService {
    /*
     * 点击节点后，执行这个操作，解析内容到 百度编辑器 里面。
     *
     */
    headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8' });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private httpData: HttpDataService) { }

    insertData(nodeId: number,nodeType:number, editor: any) {
        const url: string = this.httpData.Manage_HOST + 'pageDesignQueryFacade/getPageContent?id=' + nodeId;
        this.http.get(url)
            .map(res => res.json())
            .subscribe((res) => {
              const localHost = window.location.host;
                console.log(res);
                if (res['msg'] === 'java.lang.NullPointerException' || res['msg'] === null) {
                    editor.Instance.setContent('');
                    return false;
                }
                var parse;
                //if(nodeType==8)sessionStorage.setItem("editorStyle","phone");
                /*if (sessionStorage.getItem('editorStyle') === 'phone') {
                    if (res['msg'].phoneParse === null) {
                        parse = res['msg'].parse;
                    } else {
                        parse = res['msg'].phoneParse;
                    }
                } else {
                    parse = res['msg'].parse;
                }*/
              if (sessionStorage.getItem('editorStyle') === 'phone') {
                if (res['msg'].phoneParse === null) {
                  //parse = res['msg'].parse;
                  parse ='';
                } else {
                  parse = res['msg'].phoneParse;
                }
                sessionStorage.setItem('editorcontent', res['msg'].parse);
              } else {
                parse = res['msg'].parse;
                sessionStorage.setItem('editorcontent', res['msg'].phoneParse);
              }
                if (parse === null) {
                    editor.Instance.setContent('');
                    return false;
                }
                var datas = res['msg'].data, // 数据详细内容
                    fields = [], // 所有的字段
                    field; // 当前字段

                if (res['msg'].fields !== 0) {
                    $.each(datas, function (index, value) {
                        if (value.parse_name) { // chekcbox 解析出来的name是不一样的
                            fields.push(value.parse_name);
                        } else {
                            fields.push(value.name);
                        }
                    });
                    for (let i = 0; i < fields.length; i++) {
                        var dataType = datas[i].leipiplugins,

                            showData, // 变为预览状态的临时变量
                            data = datas[i]; // 当前数据详细内容
                        //   console.log(dataType)
                        //   console.log(data)
                        field = fields[i];
                        switch (dataType) {
                            case 'text':
                                let border; // input的边框
                                let bgColor; // input的底色
                                let hide; // input可见性
                                let groupcon; // 组合控件
                                border = data.orgthide === '0' ? '' : 'none';
                                bgColor = data.orgbghide === '0' ? '' : 'none';
                                hide = data.orghide === '0' ? '' : 'none';
                                showData = `<input name='leipiNewField' type='${data.type}' datasource='${data.datasource}' orgbghide='${data.orgbghide}'` +
                                    `title='${data.title}' value='${data.value}' orgthide='${data.orgthide}' display:${hide};` +
                                    `leipiplugins='${data.leipiplugins}' orgalign='${data.orgalign}' orghide='${data.orghide}'` +
                                    `orgwidth='${data.orgwidth}' orgfontsize='${data.orgfontsize}' orgheight='${data.orgheight}'` +
                                    `orgtype='${data.orgtype}' style="text-align:${data.orgalign}; height:${data.orgheight};` +
                                    `width:${data.orgwidth}; font-size:${data.orgfontsize}px;border:${border};background:${bgColor};${data.style}"` +
                                    `datasource='${data.datasource}' groupcon='${data.groupcon}' p_or_m='${data.p_or_m}'>`;
                                break;

                            case 'textarea':
                                showData = `<textarea name=leipiNewField title='${data.title}'` +
                                    `leipiplugins='${data.leipiplugins}' value='${data.value}'  datasource='${data.datasource}' orgrich='${data.orgrich}'` +
                                    `orgfontsize='${data.orgfontsize}' orgwidth='${data.orgwidth}' orgheight='${data.orgheight}'` +
                                    `style="width:${data.orgwidth};height:${data.orgheight};font-size:${data.orgfontsize}px;${data.style}">` +
                                    `${data.value}</textarea>`;
                                break;

                            case 'select':
                                const dataValue = data.value.split(','); // 控件内容 -- 把字符串分割为数组
                                showData = `{|-<span leipiplugins='${data.leipiplugins}'>` +
                                    `<select name=leipiNewField datasource='${data.datasource}' title='${data.title}' orgwidth='${data.orgwidth}' leipiplugins='${data.leipiplugins}'` +
                                    `selected='${data.selected}' size='${data.size}' style="width:${data.orgwidth};${data.style}">`;
                                $.each(dataValue, function (key, value) {
                                    if (value === data.selected) {
                                        showData += `<option value='${value}' selected='${value}'>${value}</option>`;
                                    } else {
                                        showData += `<option value='${value}'>${value}</option>`;
                                    }
                                });
                                showData += '</select></span>-|}';
                                break;

                            case 'radios':
                                showData = `{|-<span name=leipiNewField  selected='${data.selected}' orderby='${data.orderby}' +orgwidth='${data.orgwidth}'` +
                                    `orgheight='${data.orgheight}' orgfontsize='${data.orgfontsize}'  datasource='${data.datasource}' style='display:inline-block;width:${data.orgwidth}`+
                                    `height:${data.orgheight}font-size:${data.orgfontsize} '  leipiplugins='${data.leipiplugins}' title='${data.title}'>`;
                                $.each(data.options, function (key, value) {
                                    if (value.checked !== undefined) {
                                        showData += `<input value='${value.value}' name=leipiNewField ` +
                                            `type='${value.type}' checked>${value.value}&nbsp;`;
                                    } else {
                                        showData += `<input value='${value.value}' name='leipiNewField' type='${value.type}'>${value.value}&nbsp;`;
                                    }
                                });
                                showData += '</span>-|}';
                                break;

                            case 'checkboxs':
                                showData = `{|-<span leipiplugins='${data.leipiplugins}' orderby='${data.orderby}' title='${data.title}'orgwidth='${data.orgwidth}'` +
                                `orgheight='${data.orgheight}'orgfontsize='${data.orgfontsize}' style='display:inline-block;width:${data.orgwidth};height:${data.orgheight};font-size:${data.orgfontsize}' `+
                                    `name=leipiNewField>`;
                                $.each(data.options, function (key, value) {
                                    if (value.checked !== null) {
                                        showData += `<input value='${value.value}' name=leipiNewField` +
                                            `type='${value.type}' checked=checked>${value.value}&nbsp;`;
                                    } else {
                                        showData += `<input value='${value.value}' name=leipiNewField type='${value.type}'>${value.value}&nbsp;`;
                                    }
                                });
                                showData += '</span>-|}';
                                break;

                            case 'macros':
                                showData = `<input name=leipiNewField type='${data.type}' value='${data.value}'` +
                                    `title='${data.title}' orgwidth='${data.orgwidth}'` +
                                    `leipiplugins='${data.leipiplugins}' orgtype='${data.orgtype}' orghide='${data.orghide}'` +
                                    `orgfontsize='${data.orgfontsize}' style=width:${data.orgwidth};font-size:${data.orgfontsize}px;${data.style}>`;
                                break;

                            case 'progressbar':
                                showData = `<img name='leipiNewField' title='${data.title}'` +
                                    `leipiplugins='progressbar' value='${data.value}'` +
                                    `orgsigntype='${data.orgsigntype} src='${data.src}' _src='${data.src}' />`;
                                break;

                            case 'qrcode':
                                showData = `<img name='leipiNewField' title='${data.title}'` +
                                    `value='${data.value}' orgtype='${data.orgtype}'` +
                                    `leipiplugins='${data.leipiplugins} src='${data.src}' _src='${data.src}' orgwidth='${data.orgwidth}'` +
                                    `orgheight='${data.orgheight}' style='width:${data.orgwidth};height:${data.orgheight};' >`;
                                break;

                            case 'listctrl':
                                showData = `<input name='leipiNewField' type='${data.type}' value='${data.value}' title='${data.title}'` +
                                    `leipiplugins='${data.leipiplugins}' orgtitle='${data.orgtitle}' orgcoltype='${data.orgcoltype}'` +
                                    `orgunit='${data.orgunit}' orgsumvalue='${data.orgsumvalue}'` +
                                    `orgrowvalue='${data.orgrowvalue}' orgsum='${data.orgsum}'` +
                                    `orgcolvalue='${data.orgcolvalue}' orgwidth='${data.orgwidth}' style='width:${data.orgwidth};' >`;
                                break;

                            case 'addimage':
                                showData = `<input name=leipiNewField leipiplugins='${data.leipiplugins}'` +
                                    `title='${data.title}' value='${data.value}' identity='${data.identity}' type=text datasource='${data.datasource}'` +
                                    `allowupload='${data.allowupload}'>`;
                                break;

                            case 'iframerouter':
                                showData = `<input name=leipiNewField leipiplugins='${data.leipiplugins}'` +
                                    `type=text orderby='${data.orderby}' orgtitle='${data.orgtitle}' orgsrc='${data.orgsrc}' ` +
                                    `orgtarget='${data.orgtarget}' orgchecked='${data.orgchecked}' ` +
                                    `style='width:100%;border:1px solid #ccc;height:500px;'>`;
                                break;
                            case 'asscontrol':
                                showData = `<input style='border:0;width: 30px;height: 30px;background: red;border-radius: 50%;cursor: pointer;box-shadow:5px 2px 6px #000;'` +
                                    `name=leipiNewField leipiplugins='${data.leipiplugins}' eid='${data.eid}' ename='${data.ename}'` +
                                    `nonull='${data.nonull}' pname='${data.pname}'/>`;
                                break;

                            case 'wifiblock':
                                showData = `<div orgUrl='${data.orgurl}' name="leipiNewField"
                                        leipiplugins='${data.leipiplugins}' 
                                        style="display:block border:${data.orgborder} ${data.orgcolor};border-radius:
                                        ${data.orgradius}px; text-align:${data.gAlign};width:${data.gWidth};height:${data.gHeight};
                                        font-size:${data.gFontSize}px;"orgthide="${data.gThidden}"; 
                                        orgbghide="${data.gBghidden}";orghide="${data.gHidden}">​​&#8203;${data.parse}</div>`;
                                break;

                            case 'reportcontrol':
                                showData = `<input readonly='${data.readonly}' placeholder='报表控件' name=leipiNewField leipiplugins='${data.leipiplugins}'` +
                                    `orderby='${data.orderby}' title='${data.title}' visualreport='${data.visualreport}' ` +
                                    `node_name='${data.node_name}' field='${data.field}' pid='${data.pid}' ` +
                                    `style='width: 150px;height: 30px;border:1px solid #ccc;'>`;
                                break;

                            case 'group':
                                showData += `<table class="table">` +
                                    `<tr class="search_row"><td>` +
                                    `<input  name="leipiNewField" class="search-query" type="text"  title="${data.title}" value="${data.value}" datasource="${data.datasource}" leipiplugins="${data.leipiplugins}" orghide="${data.orghide}" orgthide="${data.orgthide}" orgbghide="${data.orgbghide}" orgalign="${data.orgalign}" orgwidth="150" orgtype="text" style="border: 1px solid ; text-align: left; width: 150px;"/>` +
                                    `<button type="submit" class="search_btn">高级搜索</span></td></tr>` +
                                    `<tr><td class="navWf"><a class="jinpin" href="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=1255">精品</a><a class="tuijian" href="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=1082">推荐</a><a class="yidu" href="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=1083">已读</a><a class="shoucang" href="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=1084">收藏</a></td></tr>` +
                                    `<tr><td>` +
                                    `<div class="wifiblockBox"><div class="wifiblock" groupcon="${data.groupcon}" orgvalue="${data.gValue}" orgTitle="${data.gTitle}" orgurl="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=${data.orgfUrl}" style="display: flex;display: -webkit-flex;color: #333;">` +
                                    `<div class="wfImg" ><input groupcon="${data.groupcon}" name="leipiNewField"  type="text" title="${data.title}" style="display: block;width: 100%;height: 100%;" value="${data.value}" datasource="${data.datasource}" leipiplugins="${data.leipiplugins}"></div>` +
                                    `<div class="wfDetail">` +
                                    `<div class="title"><input groupcon="${data.groupcon}" name="leipiNewField" type="text" title="${data.title}" value="${data.title}" datasource="${data.datasource}" leipiplugins="${data.leipiplugins}" orghide="${data.orgthide}" orgthide="${data.otgthide}" orgbghide="${data.orgbghide}" orgalign="${data.orgalign}" orgwidth="${data.orgwidth}" orgtype="${data.orgtype}" style="border: 1px solid; text-align: left; width: 150px;"/></div>` +
                                    `<div class="detail"><input groupcon="${data.groupcon}" title="${data.title}" name="leipiNewField" leipiplugins="${data.leipiplugins}" value="${data.value}" orgrich="${data.orgrich}" datasource="${data.datasource}" orgfontsize="${data.orgfontsize}" orgwidth="${data.orgwidth}" orgheight="${data.orgheight}" style="width:300px;height:80px; "/></div>` +
                                    `<div class="autor"><input groupcon="${data.groupcon}" class="title" name="leipiNewField" type="text" title="文本框" value="" datasource="" leipiplugins="text" orghide="1" orgthide="0" orgbghide="1" orgalign="left" orgwidth="150" orgtype="text" style="border: 1px solid; text-align: left;"/></div>` +
                                    `<div class="confscource"><p groupcon="${data.groupcon}" class="title" name="leipiNewField" type="text" title="文本框" value="" datasource="" leipiplugins="text" orghide="1" orgthide="0" orgbghide="1" orgalign="left" orgwidth="150" orgtype="text" style="border: 1px solid; text-align: left; width: 150px;"/></div>` +
                                    `</div></div></div></td></tr></table>`;
                                break;
                            case 'pinglun':
                                showData = '<ul leipiplugins="pinglun" datasource=""></ul>'
                                break;
                            case 'conterie':
                                showData = `<div class="wifiblockBox conterie">
                               <div class="header" style="width: 100%;display:flex;align-items: center;height: 45px;background:#16bbdf;font-size: 20px;justify-content: center">圈子</div>
                               <div class="wifiblock bodies" name="leipiNewField" leipiplugins="wifiblock" orgthide="1" value="" title="请输入内容" orgalign="left" orgheight="" orgwidth="500" orgfonts="" orgborder="1px solid" orgcolor="#000000" orgradius="1" style="style="padding: 13px;  border-bottom: 1px solid #f5f5f5;"">​
                                 <div class="b_header" style="display: flex;align-items: center">
                                   <input name="leipiNewField"  groupCon="pid" class="bh_img" style="width: 68px;height:68px;padding:0;border-radius:34px;background: #00a0e9;" type="text" title="图片上传" value="图片上传 - 控件" datasource="{&quot;data&quot;:&quot;圈子132&quot;,&quot;field&quot;:&quot;data1&quot;}" leipiplugins="addimage">
                                   <div class="bh_data" style="margin-left: 10px;">
                                   <input name="leipiNewField" groupCon="pid" type="text" title="文本框" value="姓名" datasource="{&quot;data&quot;:&quot;圈子132&quot;,&quot;field&quot;:&quot;data2&quot;}" leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" orgtype="text" style="border: none;">
                                   <input name="leipiNewField" groupCon="pid" type="text" title="文本框" value="登陆时间" datasource="{&quot;data&quot;:&quot;圈子132&quot;,&quot;field&quot;:&quot;data3&quot;}" leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" orgtype="text" style="border: none;">
                                  </div>
                                  <div style="flex: 1;display: flex;justify-content: flex-end"><div class="seebtn"><i class="i_font ic-jiahao" style="color:#a0a0a2"></i>关注</div></div>
                                 </div>
                                 <div class="b_body" style="display: flex;align-items: center;margin-top: 10px;">
                                   <input name="leipiNewField" class="bh_img" groupCon="pid" style="width: 90px;height: 65px;" type="text" title="图片上传" value="图片上传 - 控件" datasource="{&quot;data&quot;:&quot;圈子132&quot;,&quot;field&quot;:&quot;data4&quot;}" leipiplugins="addimage">
                                   <input name="leipiNewField" groupCon="pid" type="text" title="文本框" value="内容" datasource="{&quot;data&quot;:&quot;圈子132&quot;,&quot;field&quot;:&quot;data5&quot;}" leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" orgtype="text" style="border: none;">
                                 </div>
                                 <div class="b_foot" style="display: flex;align-items: center;flex-direction:row-reverse;height: 25px;margin-top: 10px;">
                                   <div  class="i_font ic-zhuanfa zhuanfa"><i></i>转发</div>
                                   <div  class="i_font ic-dianzan dianzan"><i></i>点赞</div>
                                   <div  class="i_font ic-pinglun pinglun"><i></i>评论</div>
                                 </div>
                                 <div class="pinglunbox" >
                                    <ul name="leipiNewField" groupCon="pid"  title="评论"  datasource="" leipiplugins="pinglun" >
                                    </ul>
                                 </div>
                               </div>
                               <div class="inputKeys" >
                                 <div class="inputbox" >
                                  <input type="text" class="txt" style="outline: none;">
                                </div>
                                 <div class="inputbtn" >
                                   回复
                                 </div>
                               </div>
                             </div>`
                                break;
                            case 'button':
                                showData = `<input name=leipiNewField leipiplugins=button mode='${data.mode}' orderby='${data.orderby}' ` +
                                    `orgtitle='${data.orgtitle}' orgsrc='${data.orgsrc}' orgbgcolor='${data.orgbgcolor}' orgname='${data.orgname}' ` +
                                    `orgheight='${data.orgheight}' orgwidth='${data.orgwidth}' orgfontcolor='${data.orgfontcolor}' orgurl='${data.orgurl}' formnode='${data.formnode}' btntype='${data.btntype}' tgnode='${data.tgnode}' winname='${data.winname}'>`;
                                break;

                            case 'pagedetails':
                                showData = `<div class='wifiblockBoxs' style='border: 1px solid #ddd;'>
                                <div class='header_top' style='position: relative;'><span onclick='history.go(-1)' style='position: absolute;left: 20px;'>&lt;</span>书籍详情</div>
                                <div class='contains'>
                                    <div class='contains_img'>
                                        <input groupCon='' name='leipiNewField'  type='text' identity='图片上传' title='图片上传' style='display: block;width: 100%;height: 100%;' value='图片上传 - 控件' datasource='' leipiplugins='addimage'>
                                    </div>
                                    <div class='contains_detail'>
                                        <div class='contains_title'>
                                            <input groupCon='' name="leipiNewField" type="text" title="文本框" value="书名" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                        </div>
                                        <div class='contains_content'>
                                            作者：<input groupCon='' name="leipiNewField" type="text" title="文本框" value="作者" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                        </div>
                                        <div class='contains_content'>
                                            出版社：<input groupCon='' name="leipiNewField" type="text" title="文本框" value="出版社" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                        </div>
                                        <div class='contains_content'>
                                            IBSN：<input groupCon='' name="leipiNewField" type="text" title="文本框" value="IBSN" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                        </div>
                                        <div class='contains_content'>
                                            推荐对象：<input groupCon='' name="leipiNewField" type="text" title="文本框" value="推荐对象" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                        </div>
                                        <div class='contains_content'>
                                            推荐理由：<input groupCon='' name="leipiNewField" type="text" title="文本框" value="推荐理由" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                        </div>
                                    </div>
                                </div>
                                <div class='spacing'>
                                    <div class='contains_title' style='font-size: 14px;'>
                                        <input groupCon='' name="leipiNewField" type="text" title="文本框" value="简介" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                    </div>
                                    <div class='contains_content'>
                                        <input groupCon='' name="leipiNewField" type="text" title="文本框" value="简介内容" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;"/>
                                    </div>
                                </div>
                                <div class='nav_container'>
                                    <div id='books' class='nav_btn nav_btnActive'>图书</div>
                                    <div id='audio' class='nav_btn'>音频</div>
                                    <div id='video' class='nav_btn'>视频</div>
                                    <div id='question' class='nav_btn'>题库</div>
                                </div>
                                <div data-allowjump='false' class='wifiblock books_con' name='leipiNewField' leipiplugins='wifiblock' orgUrlName="${data.orgUrlName}" orgUrlId="${data.orgUrlId}" orgvalue="" orgTitle="" orgurl="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=${data.orgfUrl}" style='padding: 8px;border-bottom: 1px solid #ddd;'>
                                    <div class='nav_top nav_books'>
                                        <input groupCon='' name='leipiNewField' type='text' identity='文件上传' title='文件上传' style='display: block;width: 100%;height: 100%;' value='文件上传 - 控件' datasource='' leipiplugins='addimage'>
                                    </div>
                                </div>
                                <div data-allowjump='false' class='wifiblock audio_con' name='leipiNewField' leipiplugins='wifiblock' orgUrlName="${data.orgUrlName}" orgUrlId="${data.orgUrlId}" orgvalue="" orgTitle="" orgurl="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=${data.orgfUrl}" style='padding: 8px;border-bottom: 1px solid #ddd;'>
                                    <div class='nav_top nav_audio'>
                                        <div style='flex: 2;'>
                                            <input class='audioInput' groupCon='' name='leipiNewField' type='text' identity='文件上传' title='文件上传' style='display: block;width: 100%;height: 100%;' value='文件上传 - 控件' datasource='' leipiplugins='addimage'>
                                        </div>
                                        <audio src='' controls loop='false' class='audio'></audio>
                                    </div>
                                    <div class='nav_bottom'>
                                        <div class='iconfont icon-bofangsanjiaoxing'><i></i>23384次播放</div>
                                        <div class='iconfont icon-shijian'><i></i>00分00秒</div>
                                    </div>
                                </div>
                                <div data-allowjump='false' class='wifiblock video_con' name='leipiNewField' leipiplugins='wifiblock' orgUrlName="${data.orgUrlName}" orgUrlId="${data.orgUrlId}" orgvalue="" orgTitle="" orgurl="http://`+localHost+`/editor/assets/ueditor/formdesign/preview.html?link=${data.orgfUrl}" style='padding: 8px;border-bottom: 1px solid #ddd;'>
                                    <div class='nav_top nav_video'>
                                        <input groupCon='' name='leipiNewField'  type='text' identity='视频上传' title='视频上传' style='display: block;width: 100%;height: 100%;' value='视频上传 - 控件' datasource='' leipiplugins='addimage'>
                                        <div class='video' style='margin-left: 100px;'></div>
                                    </div>
                                </div>
                                <div class='question_con'></div>
                                <div style='padding: 8px;display: flex;'>
                                    <div style='margin-right: 16px;'><input groupCon='' name="leipiNewField" type="text" title="文本框" value="评论" datasource='' leipiplugins="text" orghide="0" orgthide="1" orgbghide="0" orgalign="left" orgwidth="150" style="border: 1px solid; text-align: left; width: 150px;padding: 4px 6px !important;"/></div>
                                    <div class='iconfont icon-fenxiang' style='margin-right: 16px;'><i></i></div>
                                    <div class='iconfont icon-guanzhu'><i></i></div>
                                </div>
                            </div>`
                                break;
                            case 'sort':
                                showData = `<input name='leipiNewField' leipiplugins='sort' title='sort' nodeid='${data.nodeid}'>`;
                                break;
                            case 'routerclassify':
                                showData = `<div></div>`;
                                break;
                            case 'glc':
                              showData = `<input name="leipiNewField" type="text" title="管理条控件" value="管理 - 控件" leipiplugins="glc" nodeid="${data.nodeid}" style="width: 80px;height: 30px;">`;
                              break;
                            case 'tpl':
                              showData = `<input home="${data.home}" site="${data.site}" work="${data.work}" msg="${data.msg}" workbench="${data.workbench}" personal="${data.personal}" choicetpl="${data.choicetpl}" tpltype="${data.tpltype}" isshow="${data.isshow}" name="leipiNewField" type="text" title="tpl" value="tpl" leipiplugins="tpl" style="height: 20px;width: 20px;border-radius: 8px;" />`;
                              break;
                            case 'mtpl':
                              showData = `<input home=${data.home} site=${data.site} work=${data.work} msg=${data.msg} name="leipiNewField" type="text" title="mtpl" value="mtpl" leipiplugins="mtpl" style="height: 20px;width: 20px;border-radius: 8px;" />`;
                              break;
                            case 'formlist':
                              showData = `<input datasource="${data.datasource}" datafield="${data.datafield}" headshow="${data.headshow}" tpl="${data.tpl}" pagesize="${data.pagesize}" frmedit="${data.frmedit}" frmdel="${data.frmdel}" style="${data.style}" name="leipiNewField" type="text" title="${data.title}" value="列表" leipiplugins="formlist" />`;
                              break;
                            case 'wxgrouptag':
                              showData = `<input name="leipiNewField" type="text" title="微信分组标签" value="微信分组标签" leipiplugins="wxgrouptag" style="width: 90px;height: 30px;"/>`;
                              break;
                             case "onlinehard":
                             case "workword":
                             case "workform":
                             case "workflow":
                             case "schedule":
                             case "task":
                             case "beike":
                             case "resource":
                             case "teach":
                             case "class":
                             case "curriculum":
                             case "jiangtang":
                             case "zujuan":
                             case "yuejuan":
                             case "chaxun":
                             case "audit":
                              showData = `<input width="${data.orgwidth}" height="${data.orgheight}"  home=${data.home}  name="leipiNewField" type="text" title="mtpl" value="mtpl" leipiplugins="mtpl" style="height: 20px;width: 20px;border-radius: 8px;" />`
                              break;
                            default:
                                showData = '您保存的数据错误...(系统显示)';
                                break;
                        }
                        var parsen, // parse临时变量 i 为 0 1 时使用
                            parsec; // 临时变量

                        if (i === 0) {
                            parsen = parseShow(parse, field);
                            editor.Instance.setContent(parsen);
                        } else if (i === 1) {
                            parsec = parseShow(parsen, field);
                            editor.Instance.setContent(parsec);
                        } else {
                            parsec = parseShow(parsec, field);
                            editor.Instance.setContent(parsec);
                        }

                    }
                } else {
                    if (sessionStorage.getItem('editorStyle') === 'phone') {
                        editor.Instance.setContent(res['msg'].phoneParse);
                    } else {
                        editor.Instance.setContent(res['msg'].parse);
                    }
                }

                function parseShow(obj, dataField) {
                    return obj.replace(`{${dataField}}`, showData);
                }
            });
    }
}
