import React, { Component, PropTypes as T } from 'react'
import I from 'react-immutable-proptypes'
import { remote } from 'electron'
import styles from './PlayerControl.scss'
import { formatMilliseconds } from '../../utils/formatMilliseconds'

class PlayerControl extends Component {
  handleSongChange = () => {
    const { list, onSongSelected, songIndex } = this.props,
          index = Math.max(0, songIndex)

    onSongSelected(list.get(index), index)
  }

  handleSongNext = () => {
    const { onNext, list, count } = this.props
    let { songIndex } = this.props

    songIndex += 1
    const index = Math.min(count, songIndex) // eslint-disable-line one-var

    onNext(list.get(index), count, index)
  }

  handleSongPrev = () => {
    const { onPrev, list } = this.props
    let { songIndex } = this.props

    songIndex -= 1
    const index = Math.max(0, songIndex) // eslint-disable-line one-var

    onPrev(list.get(index), index)
  }

  control = (nameClass, clickHandler) => {
    const cl = `fa fa-${nameClass}`

    return <a className={styles[nameClass]}><i className={cl} onClick={clickHandler}></i></a>
  }

  handleSongPosition = (e) => {
    const { duration, onSongPosition } = this.props,
          width = remote.getCurrentWindow().getSize()[0],
          position = duration * (e.pageX / width)

    onSongPosition(position)
  }

  progressBar = (position) => {
    return { width: `${(position / 1) * 100}%` }
  }

  render() {
    const {
      onPause,
      onResume,
      onStopped,
      playStatus,
      soundStatuses,
      artist,
      title,
      duration,
      elapsed,
      position,
      bytesLoaded
    } = this.props,
          controls = {
            play: playStatus === soundStatuses.STOPPED,
            stop: playStatus !== soundStatuses.STOPPED,
            pause: playStatus === soundStatuses.PLAYING,
            resume: playStatus === soundStatuses.PAUSED
          }

    return (
      <div className={styles.player}>
        <div className={styles.progress} onClick={this.handleSongPosition.bind(this)}>
          <div className={styles.bar} style={this.progressBar(position)} />
          <div className={styles.loaded} style={this.progressBar(bytesLoaded)} />
        </div>
        <div className={styles.details}>
          <img className={styles.thumb} src='https://i.scdn.co/image/9932849b7e42a167b0e2992435ba3c276d59b37c' />
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.inner}>
            <h4 className={styles.artist}>{artist}</h4>
            <div className={styles.time}>
              <span className={styles.current}>{formatMilliseconds(elapsed)}</span>
              <span>{formatMilliseconds(duration)}</span>
            </div>
          </div>
          <div className={styles.quality}>
            <span>320 кб/с</span>
          </div>
        </div>
        <div className={styles.controls}>
          { this.control('step-backward', this.handleSongPrev.bind()) }
          { controls.play && this.control('play', this.handleSongChange.bind()) }
          { controls.stop && this.control('stop', onStopped.bind()) }
          { controls.pause && this.control('pause', onPause.bind()) }
          { controls.resume && this.control('play', onResume.bind()) }
          { this.control('step-forward', this.handleSongNext.bind()) }
          { this.control('lock', this.handleSongNext.bind())}
          { this.control('repeat', this.handleSongNext.bind())}
          { this.control('random', this.handleSongNext.bind())}
          { this.control('volume-up', this.handleSongNext.bind())}
        </div>
      </div>
    )
  }
}

PlayerControl.propTypes = {
  onPause: T.func.isRequired,
  onResume: T.func.isRequired,
  onStopped: T.func.isRequired,
  onNext: T.func.isRequired,
  onPrev: T.func.isRequired,
  onSongSelected: T.func.isRequired,
  onSongPosition: T.func.isRequired,
  list: I.listOf(
    I.mapContains({
      aid: T.number.isRequired,
      url: T.string.isRequired
    })
  ),
  playStatus: T.oneOf(['PLAYING', 'PAUSED', 'STOPPED']).isRequired,
  soundStatuses: T.shape({
    PLAYING: T.string.isRequired,
    PAUSED: T.string.isRequired,
    STOPPED: T.string.isRequired
  }).isRequired,
  songIndex: T.number.isRequired,
  count: T.number.isRequired,
  duration: T.number.isRequired,
  elapsed: T.number.isRequired,
  position: T.number.isRequired,
  bytesLoaded: T.number,
  artist: T.string.isRequired,
  title: T.string.isRequired
}

export default PlayerControl
