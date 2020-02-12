'use strict';

import * as logger from "./logger.js";
import * as config from "./config.js";
import * as timeHelper from "./time.js";
import * as regexHelper from "./regex.js";

// Chart

export class Chart {

    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data)).reverse(); // dont store the reference; data is already sorted
        this.canvas = document.getElementById(config.CHART_ID);
        if(!this.canvas.getContext) {
            logger.log("Chart.js :: init() :: WARN :: No Canvas API is supported.");
        }
        this.c = this.canvas.getContext("2d");

        this.border = false;         /**< draw border */
        this.grid = false;           /**< draw grid */

        this.xOffset = 8;          /**< x offset of the graph (border) */
        this.yOffset = 8;          /**< y offset of the graph (border) */

        this.numOfXGridSec = 10;    /**< num of grid sections (x) */
        this.numOfYGridSec = 5;     /**< num of grid sections (y) */
    }

    init() {
        logger.debug("Chart.js :: init() :: INFO :: Initializing...");

        this.update();

        if(this.data == null || this.data.length < 1) {
            logger.log("Chart.js :: init() :: WARN :: There are no datapoints available.");
            return;
        }

        // calculate the bandwidth on the x axis (timestamps)
        this.yAxisLimit = 0;
        if(this.data.length > 1) {
            let minDate = this.data[0].datetime;
            let maxDate = this.data[this.data.length - 1].datetime;
            this.fullBandwidth = maxDate - minDate;

            // calculate the bandwidth on the y axis (scores)
            // @todo: solve this better
            for (let i = 0; i < this.data.length; i++) {
                if(!regexHelper.numRegex(this.data[i].score) && !regexHelper.floatRegex(this.data[i].score)) {
                    this.data[i].score = timeHelper.timestampToSeconds(this.data[i].score); // parse to seconds
                }
                let score = parseInt(this.data[i].score);
                if (score > this.yAxisLimit) {
                    this.yAxisLimit = score;
                }
            }
            this.yAxisLimit = this.yAxisLimit;
        }
    }

    update() {
        logger.debug("Chart.js :: update() :: INFO :: Updateing...");
        // initialize canvas
		this.c.clearRect(0, 0, $(this.canvas).attr("width"), $(this.canvas).attr("height"));

		$(this.canvas).attr("width", $(this.canvas).parent().width());

		this.width = this.canvas.width;
		this.height = this.canvas.height;
    }

    draw() {
        logger.debug("Chart.js :: draw() :: INFO :: Drawing...");

        if(this.data == null || this.data.length < 1) {
            logger.log("Chart.js :: draw() :: WARN :: There are no datapoints available.");
            return;
        }

        /**
         * border
         */

        if(this.border) {
            this.c.strokeStyle = "#eee";
            this.c.lineWidth = 2;
            this.c.strokeRect(this.xOffset, this.yOffset, this.getGraphWidth(), this.getGraphHeight());
        }

        /**
         * grid
         */
        if(this.grid) {
            this.c.lineWidth = 1;
            this.c.strokeStyle = "#eee";

            let gridGap;

            // x grid
            this.c.beginPath();
            gridGap = this.getGraphWidth() / this.numOfXGridSec;
            for(let index = 1; index < this.numOfXGridSec; index++) {
                this.c.moveTo(this.xOffset + gridGap * index, this.yOffset);
                this.c.lineTo(this.xOffset + gridGap * index, this.getGraphHeight() + this.yOffset);
            }
            this.c.stroke();

            // y grid
            this.c.beginPath();
            gridGap = this.getGraphHeight() / this.numOfYGridSec;
            for(let index = 1; index < this.numOfYGridSec; index++) {
                this.c.moveTo(this.xOffset, this.yOffset + gridGap * index);
                this.c.lineTo(this.getGraphWidth() + this.xOffset, this.yOffset + gridGap * index);
            }
            this.c.stroke();
        }

        /**
		 * graph
		 */

		// draw lines
        this.c.lineWidth = 2;
        this.c.fillStyle = "#2196F3";
        this.c.strokeStyle = "#2196F3";
        if(this.data.length > 1) {
            this.c.beginPath();
            for(let index = 0; index < this.data.length; index++) {
                let x = this.getXCoordinate(index);
                let y = this.getYCoordinate(index);
                // draw line
                this.c.lineTo(x, y);
            }
            this.c.stroke();
        }

        // draw points
		this.c.lineWidth = 1;
		this.c.beginPath();
        for(let index = 0; index < this.data.length; index++) {
            let x = this.getXCoordinate(index);
            let y = this.getYCoordinate(index);

            // draw points
            this.c.moveTo(x, y);
            this.c.arc(x, y, 4, 0, Math.PI * 2, true);
            this.c.fill();
        }
		this.c.stroke();
    }

    /**
	 * get x coordinate for graph
	 */
	getXCoordinate(index) {
		let min = this.data[0].datetime;
		let max = this.data[index].datetime;
        let partBandwidth = max - min;

        // if less than 2 datapoints
        if(this.data.length < 2) {
            return this.getGraphWidth() / 2;
        } else {
            return (this.getGraphWidth() / this.fullBandwidth * partBandwidth) + ((this.width - this.xOffset) / this.fullBandwidth) / 2 + this.xOffset;
        }
    }

    /**
	 * get y coordinate for graph
	 */
	getYCoordinate(index) {
        // if less than 2 datapoints
        if(this.data.length < 2) {
            return this.getGraphHeight() / 2;
        } else {
            return this.height - (this.getGraphHeight() / (this.yAxisLimit / this.data[index].score)) - this.yOffset;
        }
    }

    /**
	 * real width of graph
	 */
	getGraphWidth() {
		return this.width - this.xOffset * 2;
	}

	/**
	 * real height of graph
	 */
	getGraphHeight() {
		return this.height - this.yOffset * 2;
	}


}
