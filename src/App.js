import React, { Component } from 'react';
import './App.css';
import WebTorrent from 'webtorrent';

class App extends Component {
  state = {
    torrentName: "",
    torrentInfoHash: "",
    torrentProgress: "",
    downloadSpeed: "-"
  }

  componentDidMount() {
    // Sintel movie
    var torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
    var client = new WebTorrent();

    client.on('error', (err) => {
      console.log('Webtorrent error: ' + err.message);
    })

    client.add(torrentId, (torrent) => {
      torrent.on('download', (bytes) => {
        // Calculate progress
        var speedBytes = torrent.downloadSpeed
        var downloadSpeed = (speedBytes > (1024 * 1024))
          ? (speedBytes / (1024 * 1024)).toFixed(1) + " MB/s"
          : (speedBytes / 1024).toFixed(1) + " KB/s"
        this.setState({
          torrentProgress: (torrent.progress * 100).toFixed(1) + '%',
          downloadSpeed: downloadSpeed
        })
      })

      torrent.on('done', () => {
        console.log('DONE')
        this.setState({ downloadSpeed: "-" })
      })

      this.setState({
        torrentInfoHash: torrent.infoHash,
        torrentName: torrent.name
      })

      // Select the first ".mp4" file and play it!
      var file = torrent.files.find((file) => {
        return file.name.endsWith('.mp4')
      })

      try {
        file.renderTo('video#player', {autoplay: true, controls: true}, (err, elem) => {
          if (err) console.log('Error: ', err)
        })
      } catch (err) {
        console.log(err)
      }
    })
  }

  render() {
    return (
      <div>
        <h1>{this.state.torrentName}</h1>
        <p><b>Torrent Info Hash: </b>{this.state.torrentInfoHash}</p>
        <p><b>Torrent Progress: </b>{this.state.torrentProgress}</p>
        <p><b>Download Speed: </b>{this.state.downloadSpeed}</p>
		<video id="player"></video>
      </div>
    );
  }
}

export default App;
