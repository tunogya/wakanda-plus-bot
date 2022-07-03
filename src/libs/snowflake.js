const Snowflake = (function() {
	// eslint-disable-next-line no-shadow
	function Snowflake(_workerId, _dataCenterId) {
		/** 开始时间截 ：2022-7-1 0:0:0 */
		this.twepoch = 1656604800000n;
		
		/** 机器id所占的位数 */
		this.workerIdBits = 5n;
		
		/** 数据标识id所占的位数 */
		this.dataCenterIdBits = 5n;
		
		/**
		 * 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数)
		 * 用位运算计算n个bit能表示的最大数值，计算是 -1 左移 5，得结果a，然后 -1 异或 a
		 *
		 * 步骤
		 * 先 -1 左移 5，得结果a ：
                  11111111 11111111 11111111 11111111 //-1的二进制表示（补码，补码的意义是拿补码和原码相加，最终加出一个“溢出的0”）
            11111 11111111 11111111 11111111 11100000 //高位溢出的不要，低位补0
                  11111111 11111111 11111111 11100000 //结果a
		 
		 * 再 -1 异或 a ：

                  11111111 11111111 11111111 11111111 //-1的二进制表示（补码）
              ^   11111111 11111111 11111111 11100000 //两个操作数的位中，相同则为0，不同则为1
          ---------------------------------------------------------------------------
                  00000000 00000000 00000000 00011111 //最终结果31
		 * */
		this.maxWrokerId = -1n ^ (-1n << this.workerIdBits);
		
		/** 支持的最大数据标识id，结果是31 */
		this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits);
		
		/** 序列在id中占的位数 */
		this.sequenceBits = 12n;
		
		/** 机器ID向左移12位 */
		this.workerIdShift = this.sequenceBits;
		
		/** 数据标识id向左移17位(12序列id+5机器ID) */
		this.dataCenterIdShift = this.sequenceBits + this.workerIdBits;
		
		/** 时间截向左移22位( 12序列id + 5机器ID + 5数据ID) */
		this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;
		
		/** 生成序列的掩码，这里为4095
		 * 用位运算计算n个bit能表示的最大数值，计算是 -1 左移 12，得结果a，然后 -1 异或 a
		 *
		 * 步骤
		 * 先 -1 左移 12，得结果a ：
                  11111111 11111111 11111111 11111111 //-1的二进制表示（补码，补码的意义是拿补码和原码相加，最终加出一个“溢出的0”）
    1111 11111111 11111111 11111111 11110000 00000000 //高位溢出的不要，低位补0
                  11111111 11111111 11110000 00000000 //结果a
		 
		 * 再 -1 异或 a ：

                  11111111 11111111 11111111 11111111 //-1的二进制表示（补码）
              ^   11111111 11111111 11110000 00000000 //两个操作数的位中，相同则为0，不同则为1
          ---------------------------------------------------------------------------
                  00000000 00000000 00001111 11111111 //最终结果2^12  = 4096
		 */
		this.sequenceMask = -1n ^ (-1n << this.sequenceBits);
		
		/** 工作机器ID(0~31) */
		// this.workerId = 0n
		/** 数据中心ID(0~31) */
		// this.dataCenterId = 0n
		
		/** 上次生成ID的时间截 */
		this.lastTimestamp = -1n;
		// eslint-disable-next-line no-undef
		this.workerId = BigInt(_workerId || 0n);
		// eslint-disable-next-line no-undef
		this.dataCenterId = BigInt(_dataCenterId || 0n);
		this.sequence = 0n;
		
		// workerId 校验
		if (this.workerId > this.maxWrokerId || this.workerId < 0) {
			throw new Error(`workerId must max than 0 and small than maxWorkerId ${this.maxWrokerId}`);
		}
		// dataCenterId 校验
		if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
			throw new Error(`dataCenterId must max than 0 and small than maxDataCenterId ${this.maxDataCenterId}`);
		}
	}
	
	// ==============================Methods==========================================
	/**
	 * 获得下一个ID (该方法是线程安全的)
	 * @return bigint
	 */
	Snowflake.prototype.nextId = function() {
		let timestamp = this.timeGen();
		
		if (timestamp < this.lastTimestamp) {
			throw new Error('Clock moved backwards. Refusing to generate id for ' +
				(this.lastTimestamp - timestamp));
		}
		
		if (this.lastTimestamp === timestamp) {
			/**
			 * 按位于操作 对于每一个比特位，只有两个操作数相应的比特位都是1时，结果才为1，否则为0。
			 * 假设最开始 this.sequence 为 0n 加1后，则为1
			 * 结果如下
                00000000 00000000 00000000 00000001 //1的二进制
                00000000 00000000 00001111 11111111 //最终结果2^12  = 4096
          ---------------------------------------------------------------------------
                00000000 00000000 00000000 00000001 //结果1的二进制
			 */
			this.sequence = (this.sequence + 1n) & this.sequenceMask;
			if (this.sequence === 0n) {
				timestamp = this.tilNextMillis(this.lastTimestamp);
			}
		}
		else {
			this.sequence = 0n;
		}
		
		this.lastTimestamp = timestamp;

		return ((timestamp - this.twepoch) << this.timestampLeftShift) |
			(this.dataCenterId << this.dataCenterIdShift) |
			(this.workerId << this.workerIdShift) |
			this.sequence;
	};
	
	/**
	 * 阻塞到下一个毫秒，直到获得新的时间戳
	 * @param lastTimestamp 上次生成ID的时间截
	 * @return bigint
	 */
	Snowflake.prototype.tilNextMillis = function(lastTimestamp) {
		let timestamp = this.timeGen();
		while (timestamp <= lastTimestamp) {
			timestamp = this.timeGen();
		}
		return timestamp;
	};
	
	/**
	 * 返回以毫秒为单位的当前时间
	 * @return 当前时间(毫秒)
	 */
	Snowflake.prototype.timeGen = function() {
		// eslint-disable-next-line no-undef
		return BigInt(Date.now());
	};
	
	return Snowflake;
}());
// console.log(new Snowflake(1n, 1n).nextId());
module.exports = Snowflake