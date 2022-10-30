import http from 'http';
import { Readable, Writable, pipeline } from 'stream';
import emoji from 'node-emoji';
class MoonPhasesStream extends Readable {
  constructor (options) {
    super(options);
    this.moonPhases = [];
    this.index = 0;
    this.moonPhases.push(emoji.get(':full_moon:'));
    this.moonPhases.push(emoji.get(':waning_gibbous_moon:'));
    this.moonPhases.push(emoji.get(':last_quarter_moon:'));
    this.moonPhases.push(emoji.get(':waning_crescent_moon:'));
    this.moonPhases.push(emoji.get(':new_moon:'));
    this.moonPhases.push(emoji.get(':waxing_crescent_moon:'));
    this.moonPhases.push(emoji.get(':first_quarter_moon:'));
    this.moonPhases.push(emoji.get(':moon:'));
  }

  _read () {
    const LAST_MOON_PHASE = 8;
    const FIRST_MOON_PHASE = 0;
    this.push(this.moonPhases[this.index++]);
    if (this.index === LAST_MOON_PHASE) {
      this.index = FIRST_MOON_PHASE;
    }
  }
}

function sleep(milliseconds){
  let currentTime = new Date().getTime();
  while(currentTime + milliseconds >= new Date().getTime()){}
}
const server = http.createServer((req, risposta) => {
  const moonPhasesStream = new MoonPhasesStream();
  moonPhasesStream.on("data", function(chunk){
    let canReadNext = risposta.write(chunk);
    if(!canReadNext){
      sleep(1000)
      moonPhasesStream.pause()
      risposta.once("drain", ()=> moonPhasesStream.resume())
    }
  })
});

server.listen(3000, ()=> console.log("server running"));

