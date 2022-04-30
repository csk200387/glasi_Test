/*cskbot*/

const BufferedReader = java.io.BufferedReader
const DataOutputStream = java.io.DataOutputStream
const InputStreamReader = java.io.InputStreamReader
const HttpURLConnection = java.net.HttpURLConnection
const URL = java.net.URL
const URLEncoder = java.net.URLEncoder
NMT = (source, target, text) => {
    clientId = "h1yzRtLV4_6Y8fQsLGkb"
    clientSecret = "UYRrwLdgAD"
    try {
        text = encodeURI(text);
        apiURL = "https://openapi.naver.com/v1/papago/n2mt";
        url = new URL(apiURL);
        con = url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("X-Naver-Client-Id", clientId);
        con.setRequestProperty("X-Naver-Client-Secret", clientSecret);
        postParams = "source=" + source + "&target=" + target + "&text=" + text;
        con.setDoOutput(true);
        wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(postParams);
        wr.flush();
        wr.close();
        br = new BufferedReader(new InputStreamReader(con.getInputStream()))
        var inputLine;
        var res = ""
        while ((inputLine = br.readLine()) != null) res += inputLine;
        br.close();
        return JSON.parse(res).message.result.translatedText
    } catch (e) {
        return "***번역 오류***"
    }
}

function getCoinMark(name) {
    var data = Utils.parse("https://api.upbit.com/v1/market/all").text();
    data = JSON.parse(data);
    for (var n = 0; n < data.length; n++) {
        if (data[n].market.startsWith("KRW-") && data[n].korean_name == name) return data[n].market;
    }
    return null;
};

function comma(num){
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
}
function dday(y,m,a){
	let d = new Date();
	var r = String(Number(new Date(y,m,a).getTime()-new Date(d.getFullYear(),d.getMonth()+1,d.getDate()).getTime())/86400000);
	return r==0? "D-Day":"Day-"+r;
}



var enabled = false;
var participants = [];
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth()+1;
var date = now.getDate();
var hour = now.getHours();
var minute = now.getMinutes();
var day = now.getDay();
var time = now.getTime();


function response(room, msg, sender, isGroupChat, replier) {
    
	var cmd = msg.split(" ");
   
	if(msg == "!reload"&&sender=="차성겸"){
		Api.reload("JsBot");
		replier.reply("Reload success");
	}
	
	if(room == "KB"&&sender=="방장봇"){
		if(msg == "NeyLnA=="&&day==5){
			Api.replyRoom("아아아","[ 시간 알림 서비스 ]\n5시입니다 30분뒤 학교 셔틀버스가 출발하니 만약 집에 갈거면 준비하세요\n*외박신청 필수");
		}
		if(msg == "OOyLnA=="){
			Api.replyRoom("아아아","오늘도 날씨가 참 좋군요,,");
		}
	}
			
   
    if (cmd[0] == "/맛집") {
        cmd.shift();
        var data = Utils.parse("https://m.map.kakao.com/actions/searchView?q=" + cmd.join("%20")+"&20맛집")
            .select("li.search_item.base");
        var result = "[맛집 리스트]\n\n";
        for (var n = 0; n < data.size(); n++) {
            var datum = data.get(n);
            result += (n + 1) + ". " + datum.attr("data-title") + "\n";
            result += "주소 : " + datum.select("span.txt_g").text() + "\n";   
            result += "지도 : https://place.map.kakao.com/m/" + datum.attr("data-id");
            if (n == 1) result += "\u200b".repeat(500);
            result += "\n\n";
        }
        replier.reply(result.trim());
    }

    if (cmd[0] == "/코인") {
        var mark = getCoinMark(cmd[1]);
        if (mark == null) {
            replier.reply(cmd[1] + "(이)라는 암호화폐를 찾을 수 없습니다.");
        } else {
            var data = Utils.parse("https://api.upbit.com/v1/ticker?markets=" + mark).text();
            data = JSON.parse(data);
            replier.reply("현재 " + cmd[1] + " 시세는 " + data[0].trade_price + "원입니다.");
        }
    }

    if (cmd[0] == "/번역") {
		start = msg.split(" ")[1]
        end = msg.split(" ")[2]
        text = msg.split(" ")
        text.splice(0, 3)
        text = text.join(" ")
        replier.reply(NMT(start, end, text))
    }


    var data = msg.replace(cmd + " ", "");
    if (cmd[0] == "/주식") {
        try {
            var data = org.jsoup.Jsoup.connect("https://www.google.com/search?q=주식%20" + data.replace(/ /g, "%20")).get();
            data = data.select("g-card-section").get(0);
            var result = "[" + data.select("div.oPhL2e").text() + " 주식 정보]\n";
            result += "현재 주가 : " + data.select("span[jsname=vWLAgc]").text() + " ";
            result += data.select("span.knFDje").text() + "\n";
            result += "변동 : " + data.select("span[jsname=qRSVye]").text();
            replier.reply(result);
        } catch (e) {
            replier.reply("주식 정보 불러오기 실패");
        }
    }
   
   if (cmd[0] == "/배터리") {
      replier.reply("[ KakaoBot 1.0 배터리 상태 ]\n잔량 : "+Device.getBatteryLevel()+" %\n온도 : "+Device.getBatteryTemp()+" °C\n전압 : "+Device.getBatteryVoltage()+" mV\n충전유무 : "+Device.isCharging());
   }
   
   if (cmd[0] == "/날씨") {
      var data = msg.replace(cmd[0],"").trim();
      replier.reply(Utils.getWeatherJSON(Utils.getZoneIdByName(data)));
   }
   
   if (cmd[0] == "//eval"){
      try {
         var data = msg.replace(cmd[0], "").trim();
         replier.reply(eval(data));
      }
      catch (e) {
         replier.reply("음,,,");
      }
   }
   
   if(cmd[0] == "/가사"){
      try {
      var keyword = msg.replace(cmd[0],"").trim();
      var data1 = Utils.getWebText("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query="+keyword.replace(" ","+")+"가사").split('<span class="desc _text">')[1].split("</span>")[0].replace(/(<([^>]+)>)/g, "\n").trim();
         replier.reply("[ "+keyword+" 가사 검색 결과 ]\n"+Utils.compress()+data1);
    }
      catch (e) {
         try {
            var data2 = Utils.getWebText("https://search.naver.com/search.naver?ie=UTF-8&sm=whl_hty&query="+keyword.replace(" ","+")+"+가사").split('<p class="text no_ellipsis type_center _content_text" style="max-height: 50rem; -webkit-line-clamp: 21;">')[1].split("</div>")[0].replace(/(<([^>]+)>)/g, "\n").trim();
            replier.reply("[ "+keyword+" 가사 검색 결과 ]\n"+Utils.compress()+data2);
         }
         catch (e) {
            try {
               var data3 = Utils.getWebText("https://search.naver.com/search.naver?ie=UTF-8&sm=whl_hty&query="+keyword.replace(" ","+")+"%EA%B0%80%EC%82%AC").split('<div class="lyrics_txt _lyrics_txt">')[1].split("</div>")[0].replace(/(<([^>]+)>)/g, "").replace(/  /g,"").trim();
            replier.reply("[ "+keyword+" 가사 검색 결과 ]\n"+Utils.compress()+data3);
            }
            catch(e) {
               replier.reply("한번 더 입력해주세요\n그래도 안뜬다면 없는겁니다..");
            }
         }
      }
   }
   
   if (msg == "/러시안룰렛") {
      if (enabled) {
         replier.reply("이미 러시안룰렛이 진행중입니다.");
      } else {
         replier.reply("러시안룰렛이 시작되었어요. 참여를 원하시면 '/참여'를, 참여자들이 다 모였으면 '/시작'을 입력해주세요.");
         participants = [];
         enabled = true;
      }   
   }
   
   if(cmd[0] == "/mbti"){
      try {
         var mbti = msg.split(" ")[1].toUpperCase();
         var data = org.jsoup.Jsoup.connect("https://www.16personalities.com/ko/%EC%84%B1%EA%B2%A9%EC%9C%A0%ED%98%95-"+mbti).get().select("#main-app > main > div.with-sidebars > article > p");
         var mbtiresult = [];
         for (mbtivar = 0 ; mbtivar < data.size(); mbtivar ++){
            mbtiresult.push(data.get(mbtivar).text()+"\n");
         }
         var fin_result = mbtiresult.join("\n");
         replier.reply("[ " + mbti+ " 성격 유형 ]\n" + Utils.compress() + "\n\n" + fin_result + "\n\n출처 : 16personalities");
      }
      catch (e) {
         replier.reply("[ KakaoBot ]\n올바른 MBTI를 입력해주세요\nI/E  S/N  T/F  P/J");
      }
   }
   
   if(msg == "/영화순위"){
      var data = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?ie=UTF-8&sm=whl_hty&query=%EC%98%81%ED%99%94+%EC%88%9C%EC%9C%84").get().select("#main_pack > div.sc_new.cs_common_module.case_list.color_1._au_movie_list_content_wrap > div.cm_content_wrap > div > div > div.mflick > div._panel_popular._tab_content > div.list_image_info.type_pure_top > div > ul:nth-child(1)").select("strong.name");
      var result = [];
      for (i = 0; i < data.size(); i++){
         result.push((i+1)+". "+data.get(i).text());
      }
      var fin_result = result.join("\n");
      replier.reply("[ "+month+"월 "+date+"일 박스오피스 순위 ]\n"+Utils.compress()+"\n\n"+fin_result+"\n\n출처 : 네이버 박스오피스 순위");
   }
   
   if(msg == "/뉴스"){
      var data = org.jsoup.Jsoup.connect("https://news.google.com/topstories?hl=ko&gl=KR&ceid=KR:ko").get().select("#yDmH0d > c-wiz.zQTmif.SSPGKf.ZYcfVd > div > div.FVeGwb.CVnAc.Haq2Hf.bWfURe > div.ajwQHc.BL5WZb.RELBvb.zLBZs > div > main > c-wiz > div.lBwEZb.BL5WZb.xP6mwf > div:nth-child(1)").select("h4")
      var result = [];
      for (i = 0; i < data.size(); i++){
         result.push((i+1)+". "+data.get(i).text());
      }
      var fin_result = result.join("\n\n");
      replier.reply("[ "+month+"월 "+date+"일 뉴스 헤드라인 ]\n"+Utils.compress()+"\n\n"+fin_result+"\n\n출처 : 구글 뉴스");
   }
   
   if(msg == "/버스"){
      var data = org.jsoup.Jsoup.connect("https://bus.koreacharts.com/city-bus/37010/PHB350000389.html").get().select("body > div > div > div > section.content > div:nth-child(5)").select("td.text-center");
      var result = [];
      for(var i = 0; i < data.size(); i++){
         result.push(i +". "+data.get(i*1).text());
      }
      var fin_result = result.join("\n");
      replier.reply(fin_result);
   }


   if(cmd[0] == "/책"){
      try{
         var search = msg.replace("/책 ","").replace(" ","+");
         var result = [];
         var data = org.jsoup.Jsoup.connect("https://lib.cu.ac.kr/search/tot/result?st=KWRD&si=TOTAL&commandType=advanced&q="+search+"&st=KWRD&si=TOTAL&oi=&os=&cpp=100#previewLocation").get().select("#divContent > div > div.briefContent > div.result > form > fieldset > ul").select("li");
         var data_size = data.size();
         for (i = 0; i < data_size; i++){
            var bookName = data.get(i).select("dd.title > a").text();
            data.get(0).select("dd.info");
            result.push(bookName+"\n"+"저자 : "+data.get(i).select("dd.info").get(0).text()+"\n출판사 : "+data.get(i).select("dd.info").get(1).text()+"\n출판년도 : "+data.get(i).select("dd.info").get(2).text()+"\n자료유형 : "+data.get(i).select("dd.info").get(3).text() + "\n" + data.get(i).select("dd.holdingInfo").select("a").text().substring(0,5) + " - " + data.get(i).select("dd.holdingInfo").select("a").text().substring(5));   
         }
         replier.reply("[ 대구가톨릭대학교 중앙도서관 ]\n"+Utils.compress()+"\n\n"+result.join("\n\n\n"));
      }
      catch (e) {
         replier.reply("도서 정보를 불러올 수 없습니다\n정확한 책 제목을 입력해주세요");
      }
   }
   
   if(msg == "/학교공지"){
      var data = org.jsoup.Jsoup.connect("https://www.cu.ac.kr/plaza/notice/notice").get().select("#main_contents > div.layout > div > div > div.board_list > table > tbody").select("tr");
      var result = [];
      var data_size = data.size();
      for (i = 0; i < data_size; i++){
         var notTitle = data.get(i).select("td").get(1).text();
         var notDate = data.get(i).select("td").get(4).text();
         var notWrit = data.get(i).select("td").get(3).text();
         var notLink = data.get(i).select("td").get(1).html().split('"')[1].replace("amp;","");
         data.get(0).select("dd.info");
         result.push("- "+notTitle+"\n작성자 : "+notWrit+"\n작성일 : "+ notDate+"\nhttps://www.cu.ac.kr"+notLink);   
      }
      replier.reply("[ 대구가톨릭대학교 공지사항 ]\n"+Utils.compress()+"\n\n"+result.join("\n\n\n"));
   }
   
   if(cmd[0] == "/멜론차트"){
      if(cmd[1] == "50"){
         var data = org.jsoup.Jsoup.connect("https://www.melon.com/chart/index.htm").userAgent("Mozilla").ignoreContentType(true).get().select("#frm > div > table > tbody").select("tr.lst50");
         var result = [];
         for (i = 0; i < 50; i++){
            var songName = data.get(i).select("a").get(2).text();
            var artist = data.get(i).select("a").get(3).text();
            var albumName = data.get(0).select("a").get(5).text();
            result.push(i+1+". "+songName+" - "+artist);
         }
         replier.reply("[ "+month+"월 "+date+"일 "+hour+"시 멜론차트 Top50 ]\n"+Utils.compress()+"\n\n"+result.join("\n"));
      }
      else if(cmd[1] == "100"){
         var data = org.jsoup.Jsoup.connect("https://www.melon.com/chart/index.htm").userAgent("Mozilla").ignoreContentType(true).get().select("#frm > div > table > tbody").select("tr.lst100");
         var result = [];
         for (i = 0; i < 50; i++){
            var songName = data.get(i).select("a").get(2).text();
            var artist = data.get(i).select("a").get(3).text();
            var albumName = data.get(0).select("a").get(5).text();
            result.push(i+51+". "+songName+" - "+artist);
         }
         replier.reply("[ "+month+"월 "+date+"일 "+hour+"시 멜론차트 Top100 ]\n"+Utils.compress()+"\n\n"+result.join("\n"));
      }
   }
   
	/*if(msg == "/명언"){
		var result = [];
		var pageNum = Math.floor((Math.random()*23)+1);
		var link = org.jsoup.Jsoup.connect("https://saramro.com/goodquotes?page="+pageNum).get().select("#fboardlist > div.tbl_head01.tbl_wrap > table > tbody").get(0).select("a").attr("href");
		result.push(org.jsoup.Jsoup.connect(link).get().select("#bo_v_title > span").text()+"\n");
		var main = org.jsoup.Jsoup.connect(link).get().select("#bo_v_con > p");
		var mainText = [];
		for (var i = 0; i < main.size(); i++){
			mainText.push(main.get(i).text());
			}
		result.push(mainText.join("\n"));
		replier.reply(result.join("\n"));
   }*/
   
   if(msg == "/좋은글"){
      var result = [];
      var pageNum = Math.floor((Math.random()*29)+1);
      var link = org.jsoup.Jsoup.connect("https://saramro.com/goodread?page="+pageNum).get().select("#fboardlist > div.tbl_head01.tbl_wrap > table > tbody").get(0).select("a").attr("href");
      result.push("제목 - "+org.jsoup.Jsoup.connect(link).get().select("#bo_v_title > span").text()+"\n");
      var main = org.jsoup.Jsoup.connect(link).get().select("#bo_v_con").html().replace(/(<([^>]+)>)/g, "\n");
      var mainText = [];
      mainText.push(main);
      /*for (var i = 0; i < main.size(); i++){
         mainText.push(main.split("<br>").text());
      }*/
      result.push(mainText.join("\n"));
      replier.reply("[ 심심할 때 읽기 좋은 글 ]\n"+Utils.compress()+"\n\n"+result.join("\n"));
      
   }
   
   if(msg.includes(" vs ")){
      var [msg1, msg2] = msg.split(' vs ');
      var Num = Math.floor(Math.random()*2);
      replier.reply(msg.split(" vs ")[Num]);
   }
   
   if(msg.indexOf("메모")==0) {
      if((msg.indexOf("메모삭제")!=0)&&(msg.indexOf("메모목록")!=0)&&(msg!="메모")){
         var memo = msg.substr(3);
         var save = FileStream.append("sdcard/kakaotalkbot/"+sender+"_memo.txt", memo+"\n");
         replier.reply("메모 "+memo+" (을)를 저장하였습니다. 메모내용을 불러오실려면 '메모목록'을 입력하시고, 메모를 삭제하실려면 '메모삭제 삭제할메모'를 입력해주세요.");
      }
   }
   if(msg.indexOf("메모삭제")==0) {
      var deleteMemo = msg.substr(5);
         try{
            FileStream.write("sdcard/kakaotalkbot/"+sender+"_memo.txt", FileStream.read("sdcard/kakaotalkbot/"+sender+"_memo.txt").replace(deleteMemo, ""));
            replier.reply("메모를 정상적으로 삭제했습니다.");
         }catch(err) {
            return;
         }
   }
   if(msg=="메모목록") {
      try {
         replier.reply(FileStream.read("sdcard/kakaotalkbot/"+sender+"_memo.txt").trim());
      }
      catch (e){
         replier.reply("저장된 메모가 없습니다?");
      }
   }
   
   /*if(msg.includes("@차성겸")){
      var timetable = ["mon11","mon12","tue9","tue10","tue11","tue13","tue14","tue15","tue16","tue17","wed10","wed11","wed13","wed14","thu9","thu10","thu11","thu13","thu14"];
      var dayofWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      var isClass = dayofWeek[day];
      var Time = isClass+hour;
      if(timetable.includes(Time)==true){
         replier.reply("차성겸님은 현재 수업중입니다");
      }
      else {
         replier.reply("수업중이 아닐겁니다 전화ㄱ");
      }
   }*/
   
   if(cmd[0] == "/맞춤법"){
      var msg = msg.replace("/맞춤법 ","").replace(" ","+");
      var data = org.jsoup.Jsoup.connect("https://m.search.naver.com/p/csearch/ocontent/spellchecker.nhn?_callback=window.__jindo2_callback._spellingCheck_0&q="+msg).ignoreContentType(true).get().text().split('"notag_html":"')[1].split('"')[0];
      replier.reply("[ 맞춤법 검사 결과 ]\n"+Utils.compress()+"\n\n- 원래 문장 -\n"+msg+"\n\n- 수정한 문장 -\n"+data);
      }
      
	if(cmd[0] == "/단축"){
		try{
			var link = msg.replace("/단축 ","");
			var data = org.jsoup.Jsoup.connect("https://han.gl/shorten").data("url", link).ignoreContentType(true).post().text();
			var result = JSON.parse(data).data.shorturl;
			replier.reply("단축완료!\n"+result);
      }
		catch(e){
			replier.reply("올바른 링크를 입력해주세요");
		}
	}
	
	if(cmd[0] == "/확장"){
		try{
			var link = msg.replace("/확장 ","");
			var result = org.jsoup.Jsoup.connect("http://checkshorturl.com/expand.php?u="+link).get().select("#page > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(2) > a").text();
			replier.reply("확장완료!\n"+result);
      }
		catch(e){
			replier.reply("올바른 링크를 입력해주세요");
		}
	}
	
   if(msg.includes("년생?")&&msg.length==5){
      var gz = parseInt(year.toString().substring(2,4))+1;
      var age = parseInt(msg.substring(0,2));
      var result = 0;
      if(age < gz){
         result = gz - age;
      }
      else {
         result = 100 - age + gz;
      }
      replier.reply(msg.substring(0,2)+"년생은 한국 나이로 "+result+"살");
   }
   
   if(msg.startsWith("/별자리 ")){
      var m = msg.substr(5);
      var url = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=+"+m+"운세").get();
      var result = url.select("#yearFortune > div > div.detail.detail2 > p:nth-child(3)").text();
      if(result == ""){
         replier.reply('"자리"를 붙여 다시 검색해주세요.\n또는 검색어 결과가 없습니다.');
         return;
      }
    replier.reply("[ 오늘의 "+m+" 운세 ]\n"+Utils.compress()+"\n"+result);
   }
   if(msg.startsWith("/띠 ")){
      var m = msg.substr(3);
      var url = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query="+m+"운세").get();
      var result = url.select("#yearFortune > div > div.detail > p:nth-child(3)").text();
         if(result == ""){
         replier.reply('"띠"를 붙여 다시 검색해주세요.\n또는 검색어 결과가 없습니다.');
         return;
      }
    replier.reply("[ 오늘의 "+m+" 운세 ]\n"+Utils.compress()+"\n"+result);
   }
   
	if(cmd[0]=="/토토"){
		var msg = msg.split(" ");
		var red = parseInt(msg[1]);
		var blue = parseInt(msg[2]);
		var point = parseInt(msg[3]);
		var red_get = Math.round(blue/red*point);
		var blue_get = Math.round(blue/red*red_get);
		replier.reply("블루 "+red+"% 레드 "+blue+"% 일 때의 계산 결과입니다.\n블루에 "+point+" 포인트를 배팅할 시\n"+red_get+" 포인트 획득가능합니다\n레드에 배팅하여 저만큼 따려면\n"+blue_get+" 포인트 만큼 배팅해야 합니다\nBlue total\n봇의 추천 배팅은 "+("블루"||"레드")+" 입니다");
	}
	
	if(cmd[0]=="!b64encode"){
		var data = msg.replace("!b64encode ","");
		replier.reply(android.util.Base64.encodeToString(java.lang.String(data).getBytes("UTF-8"),android.util.Base64.DEFAULT).trim());
	}
	
	if(cmd[0]=="!b64decode"){
		var data = msg.replace("!b64decode ","");
		replier.reply(java.lang.String(android.util.Base64.decode(data, android.util.Base64.DEFAULT), "UTF-8"));
	}
	
	if(msg=="/굳정원"){
		var data = org.jsoup.Jsoup.connect("https://woowakgood.me/waktwitch/temp.html?_="+time).get();
		var wak = data.select("body > div:nth-child(1) > h2").html().split("<br>");
		var result = [];
		result.push(wak+"\n");
		for(var i = 0; i < 6; i++){
			var isedol = ["아이네","징버거","릴파","주르르","고세구","비챤"];
			var airInfo = data.select("#"+isedol[i]+" > div.card-flap.flap1 > div.card-description > p").html();
			var airTitle = data.select("#"+isedol[i]+" > div.card-title > h2 > small").html()
			if(airTitle.length != 0){
				result.push(isedol[i]+ " - "+airTitle+"\n"+airInfo+"\n");
			}
		}
		replier.reply("[ 트위치 굳정원 ]\n"+Utils.compress()+"\n\n"+result.join("\n"));
	}
	
	if(cmd[0]=="/환율"){
		var data = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query="+cmd[1]+"+환율").get().select("#_cs_foreigninfo > div > div.api_cs_wrap > div > div.c_rate > div > div.rate_spot._rate_spot > div.rate_tlt > h3 > a").select("strong").html();
		var resultcal = data.replace(',',"");
		var result = parseFloat(resultcal);
		var won = parseInt(cmd[2]);
		if(resultcal.length == 0){
			replier.reply("환율 정보를 찾을 수 없습니다.");
		}
		else {
			replier.reply("[ "+cmd[1]+" 환율 계산결과 ]\n시세 : "+result+"₩\n환산 : "+comma(result*won)+"₩");
		}
	}
	
	if(cmd[0]=="/디데이추가"){
		FileStream.write("/storage/emulated/0/Dday/"+cmd[1]+".txt",cmd[2]);
		replier.reply("제목 "+cmd[1]+" 의 디데이를 추가하였습니다");
	}
	if(cmd[0]=="/디데이"){
		var data = FileStream.read("/storage/emulated/0/Dday/"+cmd[1]+".txt");
		var dayData = data.split(".");
		var D_day = dday(dayData[0],dayData[1],dayData[2])
		replier.reply("[ D-Day 정보 ]\n"+data.replace(/'.'/g,"-")+"\n"+D_day);
	}
	
}