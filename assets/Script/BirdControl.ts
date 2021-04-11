import MainControl from "./MainControl";
import { SoundType } from "./AudioSource";
import {GameStatus} from "./GameStatus";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirdControl extends cc.Component {

    //Speed of bird
    speed: number = 0;

    // assign of main Control component
    mainControl: MainControl = null;

    /* @property(AudioSourceControl)
    audioSourceControl: AudioSourceControl = null; */

    onLoad () {
        cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mainControl = cc.Canvas.instance.node.getComponent("MainControl");
    }

    start () {

    }

    update (dt: number) {
        // If game status is not playing, stop calculate and return
        if (this.mainControl.gameStatus != GameStatus.Game_Playing) {
            return;
        }

        this.speed -= 0.05;
        this.node.y += this.speed;

        /* To make the acceleration and deceleration effects more realistic, 
        we can tilt the bird up a little angle when it is flying upwards, 
        and tilt it down an angle when it is falling. 
        Let us select a maximum tilt angle of 30 degrees. */
        var angle = -(this.speed/2) * 30;
        if (angle >= 30) {
            angle = 30;
        }
        this.node.rotation = angle;
    }

    onTouchStart (event: cc.Event.EventTouch) {
        this.speed = 2;
        this.mainControl.audioSourceControl.playSound(SoundType.E_Sound_Fly);
    }

    onCollisionEnter (other: cc.Collider, self: cc.Collider) {
        /*
        Collider Tags:
            0 -> PIPE (GAME OVER)
            1 -> SCORE
        */
        if (other.tag === 0) {
            cc.log("game over");
            this.mainControl.gameOver();
            this.speed = 0;
        }
        // collider tag is 1, that means the bird cross a pipe, then add score
        else if (other.tag === 1) {
            this.mainControl.gameScore++;
            this.mainControl.labelScore.string = this.mainControl.gameScore.toString();
            this.mainControl.audioSourceControl.playSound(SoundType.E_Sound_Score);
        }
    }
}