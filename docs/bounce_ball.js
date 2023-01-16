"use strict";

/** リセット待機時間 */
const RESET_WAIT_MAX = 60*1;

/** 重力加速度 */
const G = 9.8;

/** ボール数 */
const BALLS = 10;

/** 停止時間 */
let stop_count;

/** ボール */
let ball = [];

/**
 * 初期化
 */
function setup() {
  createCanvas(SCENE.WIDTH, SCENE.HEIGHT);
  setupBalls();
}

/**
 * 初期化:ボール
 */
function setupBalls() {
  stop_count = 0;
  for(let i = 0; i < BALLS; i++) {
    ball[i] = new Ball();
  }
}

/**
 * 描画
 */
function draw() {
  background(220);
  ball.map((line) => {
    line.movement();
    line.wallCollisionDecision();
    ellipse(line.x, line.y, line.r, line.r);
  });
  if(isReset()) {
    shutdown();
    setupBalls();
  }
}

/**
 * やり直しするか
 */
function isReset() {
  let stop_balls = 0;

  for(let i = 0; i < BALLS; i++) {
    if(ball[i].isStop()) {
      stop_balls++;
    }
  }
  if(stop_balls === BALLS) {
    stop_count += 1;
    if(stop_count > RESET_WAIT_MAX) {
      return true;
    }
  }
  return false;
}

/**
 * ボールをすべて消す
 */
function shutdown() {
  for(let i = BALLS - 1; i >= 0; i--) {
    delete ball[i];
  }
}

/**
 * クラス:ボール
 */
class Ball {
  /** 横座標 */
  x;
  /** 縦座標 */
  y;
  /** 横速度 */
  vx;
  /** 縦速度 */
  vy;
  /** 半径 */
  r;

  /**
   * 初期配置
   */
  constructor () {
    this.x = SCENE.WIDTH/2+(random()*SCENE.WIDTH-SCENE.WIDTH/2)/2;
    this.y = SCENE.HEIGHT/2+(random()*SCENE.HEIGHT-SCENE.HEIGHT/2)/2;
    this.vx = random()*200-100;
    this.vy = random()*200-100;
    this.r = random()*60+20;
    while(this.ballCollisionDecision().length > 0) {
      this.y -= this.r * 2;
    }
  }

  /**
   * 移動
   */
  movement() {
    this.x += this.vx / 60;
    this.y += this.vy / 60;
    this.vy += G;
  }

  /**
   * 当たり判定:壁
   */
  wallCollisionDecision() {
    if(this.x - this.r / 2 < 0) {
      this.x = this.r / 2;
      this.vx = this.vx * -1;
    }
    if(this.x + this.r / 2 > SCENE.WIDTH) {
      this.x = SCENE.WIDTH - this.r / 2;
      this.vx = this.vx * -1;
    }
    if(this.y + this.r / 2 > SCENE.HEIGHT) {
      this.y = SCENE.HEIGHT - this.r / 2;
      this.vx = this.vx * 0.8;
      this.vy = this.vy * -0.5;
    }
    if(Math.abs(this.vx) < 0.1) {
      this.vx = 0;
    }
    if(Math.abs(this.vy) < 0.1) {
      this.vy = 0;
    }
  }

  /**
   * 当たり判定:ボール
   * @returns [integer...] 衝突しているボール配列番号
   */
  ballCollisionDecision() {
    let result = [];
    for(let i = 0; i < BALLS; i++) {
      if(typeof ball[i] === 'undefined'
      || (this.x === ball[i].x && this.y === ball[i].y)) {
        continue;
      }
      /** 対象と自分との距離 */
      const distance = Math.sqrt(Math.pow(ball[i].x - this.x,2) + Math.pow(ball[i].y - this.y,2));
      if(this.r < distance) {
        continue;
      }
      result.push(i);
    }
    return result;
  }

  /**
   * 停止したか
   * @returns 停止した(true===停止)
   */
  isStop() {
    if(Math.abs(this.vx) < 0.1) {
      return true;
    }
    return false;
  }
}

/**
 * シーン
 */
const SCENE = {
  /** 横幅 */
  WIDTH: 400,
  /** 縦幅 */
  HEIGHT: 400
}