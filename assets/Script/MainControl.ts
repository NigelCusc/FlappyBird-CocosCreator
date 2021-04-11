import BirdControl from "./BirdControl";
import AudioSourceControl, { SoundType } from "./AudioSource";
import {GameStatus} from "./GameStatus";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainControl extends cc.Component {

    @property(cc.Sprite)
    spBg: cc.Sprite [] = [null, null];
    @property(cc.Prefab)
    pipePrefab: cc.Prefab = null;
    spGameOver: cc.Sprite = null;

    pipe: cc.Node[] = [null, null, null]

    // Start Button
    btnStart: cc.Button = null;
    // Game State 
    gameStatus: GameStatus = GameStatus.Game_Ready;

    @property(cc.Label)
    labelScore: cc.Label = null;
    // Record Score
    gameScore: number = 0;

    @property(AudioSourceControl)
    audioSourceControl: AudioSourceControl = null;

    onLoad() {
        // open Collision System
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        // open debug draw when you debug the game
        // do not forget to close when you ship the game
        collisionManager.enabledDebugDraw = false;
        // find the GameOver node, and set active property to false
        this.spGameOver = this.node.getChildByName("GameOver").getComponent(cc.Sprite);
        this.spGameOver.node.active = false;

        // Find the start button
        this.btnStart = this.node.getChildByName("BtnStart").getComponent(cc.Button);
        // Register Clicked callback
        this.btnStart.node.on(cc.Node.EventType.TOUCH_END, this.touchStartBtn, this);
    }   

    start () {
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i] = cc.instantiate(this.pipePrefab);
            this.node.getChildByName("Pipe").addChild(this.pipe[i]);
    
            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * (maxY - minY);
        }
    }

    update (dt: number) {
        // If game status is not playing, stop calculate and return
        if (this.gameStatus !== GameStatus.Game_Playing) {
            return;
        }

        // move the background node
        for (let i = 0; i < this.spBg.length; i++) {
            this.spBg[i].node.x -= 1.0;
            if (this.spBg[i].node.x <= -288) {
                this.spBg[i].node.x = 288;
            }
        }

        // move pipes
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i].x -= 1.0;
            if (this.pipe[i].x <= -170) {
                this.pipe[i].x = 430;

                var minY = -120;
                var maxY = 120;
                this.pipe[i].y = minY + Math.random() * (maxY - minY);
            }
        }
    }

    touchStartBtn() {
        // Hide start button
        this.btnStart.node.active = false;
        // Set game status to playing
        this.gameStatus = GameStatus.Game_Playing;

        // Hide GameOver node
        this.spGameOver.node.active = false;
        // Reset position of all the pipes
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * (maxY-minY);
        }
        // Reset angle and position of bird
        var bird = this.node.getChildByName("Bird");
        bird.y = 0;
        bird.rotation = 0;

        // Reset score when restarting the game
        this.gameScore = 0;
        this.labelScore.string = this.gameScore.toString();
    }

    gameOver () {
        this.spGameOver.node.active = true;

        // When game is over, show the start button
        this.btnStart.node.active = true;
        // Change game status to Game_Over
        this.gameStatus = GameStatus.Game_Over;

        // Play game over sound
        this.audioSourceControl.playSound(SoundType.E_Sound_Die)
    }
}
