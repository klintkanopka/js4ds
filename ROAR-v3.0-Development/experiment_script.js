/* create timeline */
var timeline = [];

/* preload the specified files */
var preload = {
    type: 'preload',
    images: [] /* nothing to preload yet */
}
timeline.push(preload);

/* define welcome message trial */
var welcome = {
    type: "html-keyboard-response",
    stimulus: `<h1>Welcome to the world of Lexicality!</h1>
      <p>You are searching for the gate that will return you to your home on Earth.</p>
      <p>To reach it, you must cross <strong>five</strong> valleys guarded by magical creatures.</p>
      <p>To convince them to let you pass through, you must be able to tell the difference
      between the magic words of Lexicality and English.</p>
      <p>Press any key to see how!</p>
      `
};
timeline.push(welcome);

/* define instructions trial */
var instructions = {
    type: "html-keyboard-response",
    stimulus: `
        <p>The magic words sound like fake, made-up words.
        They might look like English words, but they don't
        mean anything in English. For example, <i> laip, bove,</i> and <i>
        cigbert</i> are magic words.
        If you see a magic word, press the <strong>LEFT ARROW KEY</strong></p>
        <p>The other words will be onese you recognize.
        They are real English words like <i>is, basket,</i> and <i>lion.</i>
        If you see a real word, hit the <strong>RIGHT ARROW KEY</strong></p>
        </div>
        <p>Press any key to begin practice!</p>
      `,
    post_trial_gap: 2000
};
timeline.push(instructions);

/* practice test trials */
/* there's gotta be a better way to list out the stimuli - read in from a csv?? */

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000,
    data: {
        task: 'fixation'
    }
}

var test = {
    type: "html-keyboard-response",
    stimulus: jsPsych.timelineVariable('stimulus'),
    stimulus_duration: 2000,
    trial_duration: 5000,
    choices: ['ArrowLeft', 'ArrowRight'],
    data: {
        task: 'response', /* tag the test trials with this taskname so we can filter data later */
        correct_response: jsPsych.timelineVariable('correct_response')
    },
    on_finish: function(data){
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
}

var debrief_block = {
    type: "html-keyboard-response",
    stimulus: function() {

        var trials = jsPsych.data.get().filter({task: 'response'});
        var correct_trials = trials.filter({correct: true});
        var incorrect_trials = trials.filter({correct: false});
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        var rt = Math.round(correct_trials.select('rt').mean());
        var irt = Math.round(incorrect_trials.select('rt').mean());

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time on correct trials was ${rt}ms.</p>
          <p>Your average response time on incorrect trials was ${irt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;

    }
};

function readCSV(url) {
    return new Promise((resolve, reject) => {
        Papa.parse(
            url, {
                download: true,
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function (results) {
                    var csv_stimuli = results.data
                    resolve(csv_stimuli)
                }
            })
    })
}

async function roarBlocks(data, randomize){
    var csv_stimuli = await readCSV(data)

    csv_result = csv_stimuli
        .reduce((accum, row) => {
            if (row.realpseudo === 'real') {
                correct_response = 'ArrowRight'
            } else {
                correct_response = 'ArrowLeft'
            }
            const newRow = {
                'stimulus': '<div style="font-size:60px;">' + row.word + '</div>',
                'correct_response': correct_response
            }
            accum.push(newRow)
            return accum
        }, [])

    var csv_block = {
        timeline: [fixation, test],
        timeline_variables: csv_result,
        randomize_order: randomize
    }

    timeline.push(csv_block)
    timeline.push(debrief_block)

    jsPsych.init({
        timeline: timeline,
        on_finish: function() {  /* display data on exp end - useful for dev */
            jsPsych.data.displayData();
        }
    });
}

const data_url = 'https://raw.githubusercontent.com/klintkanopka/js4ds/main/roar/roar-blocks/ldt-stimuli.csv'
roarBlocks(data_url, true)
