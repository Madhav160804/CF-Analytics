async function main()
{
    const urlParams = new URLSearchParams(window.location.search);
    const handle1 = urlParams.get('handle1');
    const handle2 = urlParams.get('handle2');
    document.getElementById('person1').innerHTML = handle1;
    document.getElementById('person2').innerHTML = handle2;
    //chart1
    const  userURL= `https://codeforces.com/api/user.info?handles=${handle1};${handle2}&checkHistoricHandles=false`
    let userResponse = await axios.get(userURL);
    let json = userResponse.data;
    const rating = [json.result[0].rating,json.result[1].rating];
    const maxRating = [json.result[0].maxRating,json.result[1].maxRating];
    //chart2
    const userContest1 = `https://codeforces.com/api/user.rating?handle=${handle1}`;
    const userContest2 = `https://codeforces.com/api/user.rating?handle=${handle2}`;
    let userResponse1 = await axios.get(userContest1); 
    json = userResponse1.data;
    const contestNum = [json.result.length];
    let userResponse2 = await axios.get(userContest2); 
    json = userResponse2.data;
    contestNum.push(json.result.length);
    //chart3
    json = userResponse1.data;
    let bestRank1 = 100000;
    let worstRank1 = 0;
    let bestRank2 = 100000;
    let worstRank2 = 0;

    let maxDown1 = 0;
    let maxDown2 = 0;
    let maxUp1 = 0;
    let maxUp2 = 0;
    for(let i = 0; i < json.result.length; i++){
        let ratingChange = json.result[i].newRating-json.result[i].oldRating;
        bestRank1 = Math.min(bestRank1, json.result[i].rank);
        worstRank1 = Math.max(worstRank1, json.result[i].rank);
        maxDown1 = Math.min(maxDown1, ratingChange);
        maxUp1 = Math.max(maxUp1, ratingChange);
    }
    json = userResponse2.data;
    for(let i = 0; i < json.result.length; i++){
        let ratingChange = json.result[i].newRating-json.result[i].oldRating;
        maxDown2 = Math.min(maxDown2, ratingChange);
        maxUp2 = Math.max(maxUp2, ratingChange);
        bestRank2 = Math.min(bestRank2, json.result[i].rank);
        worstRank2 = Math.max(worstRank2, json.result[i].rank);
    }

    
    
    google.charts.load('current', {'packages':['bar','corechart']});
    google.charts.setOnLoadCallback(drawCharts);

    function ratingComparison() {

        let data = google.visualization.arrayToDataTable([
            ['',  handle1, handle2],
            ['Rating', rating[0], rating[1]],
            ['MaxRating', maxRating[0], maxRating[1]],
        ]);

        let options = {
            vAxis: { format: 'decimal' },
            chart: {
            title: '        ',
            subtitle: '         ',
            },
        };

        let chart = new google.charts.Bar(document.getElementById('rating-chart'));
        chart.draw(data, google.charts.Bar.convertOptions(options));

       

    }

    function contestsNumber(){
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'User');
        data.addColumn('number', 'Contests');
        data.addRows([
            [handle1, contestNum[0]],
            [handle2, contestNum[1]],
        ]);

        // Set chart options
        let options = {
            title: 'Number of Contests Participated In',
            hAxis: {
            title: 'User',
            },
            vAxis: {
            title: 'Contests',
            },
        };

        // Load the Visualization library and draw the chart
        let chart = new google.visualization.BarChart(document.getElementById('contests-num'));
        chart.draw(data, options);

    }

    function mxUp(){
        

        let data = google.visualization.arrayToDataTable([
            ['',  handle1, handle2],
            ['Max Up', maxUp1, maxUp2],
            ['Max Down', maxDown1, maxDown2],
        ]);

        let options = {
            vAxis: { format: 'decimal' },
            chart: {
            title: '        ',
            subtitle: '         ',
            },
        };

        let chart = new google.charts.Bar(document.getElementById('mx-up'));
        chart.draw(data, google.charts.Bar.convertOptions(options));

    }

    function bestTable(){
        document.getElementById('worst-h1').innerHTML = worstRank1;
        document.getElementById('worst-h2').innerHTML = worstRank2;
        document.getElementById('best-h1').innerHTML = bestRank1;
        document.getElementById('best-h2').innerHTML = bestRank2;
    }


    function drawCharts(){
       ratingComparison();
       contestsNumber();
       mxUp();
        bestTable();
    }

    
}
main();