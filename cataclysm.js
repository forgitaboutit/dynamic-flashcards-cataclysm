const pane_width = 1024;
const pane_height = 768;
const num_buildings_min = 100;
const num_buildings_max = 200;
const building_min_width = 20;
const building_max_width = 50;
const building_min_height = 50;
const building_max_height = 250;
const building_translation_duration = 2500;
const building_fade_in_duration = 1500;
const bomb_fade_duration = 1000;
const bomb_border_color_not_selected = 'red';
const bomb_border_color_selected = 'yellow';
const bomb_border_color_chosen = '#00ee76';
const min_bomb_fall_time = 50000;
const max_bomb_fall_time = 100000;

let instructions_showing = false;
let blocker = false;
let entering_text = false;
let selection_made = false;
let current_input_text = '';
let num_correct = 0;
let num_incorrect = 0;
let building_data = Array(random(num_buildings_min, num_buildings_max));
let selected_bomb_index = 0;
let chosen_bomb_index = null;
let building_rgb_val, building_fill;
let ctr0 = 0, ctr1 = 0, ctr2 = 0;

let exercise_data = [
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)},
  {challenge:'1 + 1', response:'2', time_to_fall:random(min_bomb_fall_time, max_bomb_fall_time)}
];

window.onload = function() {

  document.getElementById('instructions_toggler').addEventListener('click', function() {

    if(instructions_showing === false) {
      document.getElementById('instructions_toggler').title = 'Hide Instructions';
      d3.select('#instructions').transition().duration(250).style('opacity', '1');
      instructions_showing = true;
    }
    else {
      document.getElementById('instructions_toggler').title = 'View Instructions';
      d3.select('#instructions').transition().duration(250).style('opacity', '0');
      instructions_showing = false;
    }
  });

  for(let ctr = 0; ctr < building_data.length; ctr++) {
    building_rgb_val = 112 + Math.floor(1 + (1 + 12 - 1) * Math.random()) * 8;
    building_fill = "rgb(" + building_rgb_val + "," + building_rgb_val + "," + building_rgb_val + ")"; 

    building_data[ctr] = {
      'width': random(building_min_width, building_max_width),
      'height': random(building_min_height, building_max_height),
      'fill': building_fill
    }
    building_data[ctr].x = Math.floor(Math.random() * (pane_width - building_data[ctr].width));
    building_data[ctr].y = pane_height - building_data[ctr].height;
  }

  d3.select("#main_pane")
    .append("svg:svg")
      .attr("width", 1024)
      .attr("height", 768)
      .attr('id', 'svg_main')
      .attr('align', 'center')
      .style('border', '1px solid black')
      .style('background-color', '#C8EFFE');

  // buildings
  d3.select('#svg_main').selectAll('rect')
    .data(building_data)
      .enter()
        .append('svg:rect')
          .attr('x', function(d) { return d.x; })
          .attr('y', function(d) { return Math.floor((pane_height - d.height) * Math.random()); })
          .attr('width', function(d) { return d.width; })
          .attr('height', function(d) { return d.height; })
          .attr('fill', function(d) { return d.fill; })
          .attr('stroke', 'black')
          .style('opacity', '0')
            .transition()
            .duration(building_fade_in_duration)
            .style('opacity', '1');

  d3.select('#svg_main').selectAll('rect')
    .transition()
      .duration(building_translation_duration)
      .delay(building_fade_in_duration)
        .attr('y', function(d) { return pane_height - d.height; });

  // bombs
  d3.select('#svg_main').selectAll('circle').data(exercise_data)
    .enter()
      .append('svg:circle')
        .attr('stroke', function(d) { return ctr0++ === 0 ? bomb_border_color_selected : bomb_border_color_not_selected } )
        .attr('id', function(d) { return 'bomb_' + ctr1++; })
        .attr('cx', function(d) { return 50 + ctr2++ * 100; })
        .attr('cy', function(d) { return -d.challenge.length * 10 - 5; })
        .attr('r', function(d) { return d.challenge.length * 10; })
        .attr('fill', 'black')
        .attr('stroke-width', '5')
        .style('opacity', '0')
        .on('click', function() {
        console.log(this.id);
          if(blocker === false) {
            blocker = true;
            let index = parseInt(this.id.charAt(this.id.length - 1));
            if(index === selected_bomb_index && chosen_bomb_index === null) {
              chosen_bomb_index = selected_bomb_index;
              document.getElementById('challenge').innerHTML = exercise_data[chosen_bomb_index].challenge;
              document.getElementById('challenge').style.color = 'green';
              document.getElementById('response').innerHTML = '';
              document.getElementById('response').style.color = 'green';
              entering_text = true;
              d3.select('#bomb_' + selected_bomb_index)
                .attr('stroke', bomb_border_color_chosen);
            } else if(index !== selected_bomb_index) {
              d3.select('#bomb_' + selected_bomb_index)
                .attr('stroke', bomb_border_color_not_selected);
              selected_bomb_index = index;	
              chosen_bomb_index = index;
              document.getElementById('challenge').innerHTML = exercise_data[chosen_bomb_index].challenge;
              document.getElementById('challenge').style.color = 'green';
              document.getElementById('response').innerHTML = '';
              document.getElementById('response').style.color = 'green';
              entering_text = true;
              d3.select('#bomb_' + selected_bomb_index)
                .attr('stroke', bomb_border_color_chosen);
            }
            blocker = false;
          }
        });

  ctr0 = 0;
  ctr1 = 0;

  // labels
  d3.select('#svg_main').selectAll('text').data(exercise_data)
      .enter()
        .append('svg:text')
          .text(function(d) { return d.challenge; })
          .style('font-family', 'Courier')
          .style('fill', 'white')
          .style('font-weight', 'bold')
          .style('opacity', '0')
          .attr('id', function(d) { return 'text_' + ctr0++; })
          .attr('x', function(d) { return ctr1++ * 100 + ((100 - d.challenge.length * 10) / 2); })
          .attr('y', function(d) { return -d.challenge.length * 10; } );

  setTimeout("fadeInBombs()", building_fade_in_duration + building_translation_duration);
  setTimeout("dropBombs()", building_fade_in_duration + building_translation_duration);

  document.onkeypress = respondToKey;
}

function random(min, max) {
  return Math.floor(min + (1 + max - min) * Math.random());
}

function fadeInBombs() {

  d3.select('#svg_main').selectAll('circle')
    .transition()
    .duration(bomb_fade_duration)
    .style('opacity', '1');

  d3.select('#svg_main').selectAll('text')
    .transition()
    .duration(bomb_fade_duration)
    .style('opacity', '1');
}

function dropBombs() {

  d3.select('#svg_main').selectAll('circle')
    .transition()
    .delay(bomb_fade_duration)
    .duration(function() { return exercise_data[parseInt(this.id.charAt(this.id.length - 1))].time_to_fall } )
    //.ease('linear')
    .attr('cy', pane_height);

  d3.select('#svg_main').selectAll('text')
    .transition()
    .delay(bomb_fade_duration)
    .duration(function() { return exercise_data[parseInt(this.id.charAt(this.id.length - 1))].time_to_fall } )
    //.ease('linear') 
    .attr('y', pane_height);
}

function respondToKey(e)
{
  if(blocker === false)
  {
    blocker = true;

    if(entering_text === false) {
      current_input_text = '';
      if(e.charCode === 13) { // enter key
        chosen_bomb_index = selected_bomb_index;
        document.getElementById('challenge').innerHTML = exercise_data[chosen_bomb_index].challenge;
        document.getElementById('challenge').style.color = 'green';
        document.getElementById('response').innerHTML = '';
        document.getElementById('response').style.color = 'green';
        d3.select('#bomb_' + selected_bomb_index)
          .attr('stroke', bomb_border_color_chosen);
        entering_text = true;
      } else if(e.charCode === 106) { // j
        d3.select('#bomb_' + selected_bomb_index)
          .attr('stroke', bomb_border_color_not_selected);
        newSelection('backward');
      } else if(e.charCode === 102 || e.charCode === 32) { // f or spacebar
        d3.select('#bomb_' + selected_bomb_index)
          .attr('stroke', bomb_border_color_not_selected);
        newSelection('forward');
      }
      /*
        // Targeting by digit makes sense if targets have visible numbers attached to them
      else if(e.charCode >= 48 && e.charCode <= 57) { // digit
        let index = e.charCode - 48;
        if(index === selected_bomb_index && chosen_bomb_index === null) {
          chosen_bomb_index = selected_bomb_index;
          entering_text = true;
          d3.select('#bomb_' + selected_bomb_index)
            .attr('stroke', bomb_border_color_chosen);
        } else if(index !== selected_bomb_index) {
          d3.select('#bomb_' + selected_bomb_index)
            .attr('stroke', bomb_border_color_not_selected);
          selected_bomb_index = index;	
          chosen_bomb_index = index;
          entering_text = true;
          d3.select('#bomb_' + selected_bomb_index)
            .attr('stroke', bomb_border_color_chosen);
        }
      }
      */
    } else if (entering_text === true) {
      if(e.charCode === 13) {
        if(current_input_text === exercise_data[selected_bomb_index].response) {
          d3.select('#bomb_' + selected_bomb_index)
            .transition()
            .duration(500)
            .style('opacity', '0');
          d3.select('#text_' + selected_bomb_index)
            .transition()
            .duration(500)
            .style('opacity', '0');
          newSelection('forward');
          entering_text = false;
          num_correct++;
          document.getElementById('num_correct').innerHTML = num_correct;
        } else {
          entering_text = false;
          d3.select('#bomb_' + selected_bomb_index).attr('stroke', bomb_border_color_selected);
          num_incorrect++;
          document.getElementById('num_incorrect').innerHTML = num_incorrect;
        }
        document.getElementById('challenge').innerHTML = '';
        document.getElementById('challenge').style.color = 'grey';
        document.getElementById('response').innerHTML = '';
        document.getElementById('response').style.color = 'grey';
        current_input_text = '';
      }
      else
      {
        current_input_text += String.fromCharCode(e.charCode);
        document.getElementById('response').innerHTML = current_input_text.length > 7 ? current_input_text.slice(0, 7) + '...' : current_input_text;
      }
    }
    blocker = false;
  }
}

function newSelection(direction)
{
  let new_selection = false;

  while(!new_selection) {

    switch(direction) {
      case 'backward':
        if(--selected_bomb_index < 0) { selected_bomb_index = exercise_data.length - 1; } break;
      case 'forward':
        if(++selected_bomb_index > exercise_data.length - 1) { selected_bomb_index = 0; } break;
    }
    if(d3.select('#bomb_' + selected_bomb_index).style('opacity') === '1') {
      d3.select('#bomb_' + selected_bomb_index).attr('stroke', bomb_border_color_selected);
      new_selection = true;
    }
  }
}
