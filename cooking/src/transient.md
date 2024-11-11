# 瞬态存储

瞬态存储（Transient Storage）是 Solidity 0.8.24 版本中新引入的一种数据位置类型。它提供了一种在单个交易执行期间临时存储数据的机制，这些数据会在交易结束后自动清除。该特性通过 EIP-1153 提案实现，是对现有数据位置（内存、存储、调用数据）的补充。

## 为什么需要瞬态存储
### 永久存储（Storage）的局限性

- **高昂的 Gas 成本**：每次 SSTORE 操作至少需 20,000 gas（首次写入），这对于临时数据而言成本过高。
- **状态膨胀**：所有数据都永久存储在链上，导致区块链状态不断增长。
- **清理成本**：删除不再需要的存储数据同样需要支付额外的 gas。

#### 内存（Memory）的局限 ???

- **作用域限制**：仅限于单个函数调用，无法跨函数调用保持状态。
- **大小限制**：内存空间有限，大量数据处理可能导致 Out of Gas 错误。

#### 堆栈（Stack）的约束 ???
- **严格的大小限制**：只能存储少量数据，适合简单操作。
- **访问模式受限**：只能采用后进先出的方式访问，限制了灵活性。

### 瞬态存储的优势

- **成本效益**：显著降低操作成本（约 100 gas/操作），无需支付清理成本，避免链上状态膨胀。
- **功能优势**：可在整个交易生命周期内保持状态，适合存储中间计算结果，交易结束后自动清理，无需手动管理。

瞬态存储填补了以太坊现有存储机制的空缺，为开发者提供了一个经济高效的临时数据存储方案，尤其适合那些数据只需在单个交易内有效且需要频繁读写的场景。


## 如何使用瞬态存储

1. 瞬态存储可以使用过 `tstore` 和 `tload` 汇编指令实现：

```solidity
contract TransientStorageExample {
    function example() public {
        assembly {
            // 存储值
            tstore(0x01, 100)
            
            // 其它操作

            // 读取值
            let value := tload(0x01)
        }
    }
}
```

2. 使用 `transient` 关键字（在 Solidity 0.8.27 之后的版本中）：

```solidity
contract TransientStorageExample {
    uint transient tempValue;

    function example() public {
        tempValue = 100;

        // 其它操作

        return tempValue;
    }
}
```

3. 一个使用瞬态存储实现的重入锁：

```solidity
pragma solidity ^0.8.28;

contract TReentrant {
    mapping(address => bool) claimed;
    bool transient locked;

    modifier nonReentrant {
        require(!locked, "Reentrancy attempt");

        locked = true;

        _;

        locked = false;
    }

    function claim() nonReentrant public {
        require(!claimed[msg.sender], "Already claimed");

        // mint / airdrop / other actions

        claimed[msg.sender] = true;
    }
}
```

4. 错误使用瞬态存储的例子：

```solidity
pragma solidity ^0.8.28;

contract TMultiplier {
    uint public transient multiplier;

    function setMultiplier(uint mul) external {
        multiplier = mul;
    }

    function multiply(uint value) external view returns (uint) {
        return value * multiplier;
    }
}
```

```
setMultiplier(100);
multiply(1); // 返回 0，而不是 100
multiply(2); // // 返回 0.，而不是 200
```

如果示例使用内存或存储来存储乘数，它将是完全可组合的。无论是将交易拆分为单独的交易还是以某种方式将它们组合在一起，都没有关系。总是会得到相同的结果：在 `multiplier` 设置为 `100` 后，后续调用将分别返回 `100` 和 `200`。这使得可以将来自多个交易的调用批量处理在一起以减少 gas 费用。 

瞬态存储可能会破坏这样的用例，因为可组合性不再是理所当然的。在这个例子中，如果调用不是在同一交易中执行的，则 `multiplier` 将被重置，后续对函数 `multiply` 的调用将始终返回 `0`。


## 瞬态存储与传统存储对比

### 1. 特性对比表

| 特性         | 传统存储       | 瞬态存储          |
|--------------|----------------|-------------------|
| 生命周期     | 永久存在于区块链 | 仅在当前交易有效  |
| 数据持久性   | 永久保存       | 交易结束自动清除  |
| 写入成本     | 高（首次 20k gas） | 低（约 100 gas）  |
| 读取成本     | 较高（2.1k gas） | 低（约 100 gas）   |  ???
| 支持类型     | 所有数据类型   | 仅值类型          |
| 跨合约访问   | 可通过接口访问 public/external 变量 | 仅合约内部可访问 |


## 总结 ???

1. **生命周期**
   - 瞬态存储的数据仅在当前交易执行期间有效，交易结束后将自动清除，确保其临时性。

2. **Gas 效率**
   - 瞬态存储的写入和读取成本显著低于传统存储，能够有效节省交易的 Gas 消耗，特别适合临时数据存储。

3. **使用场景**
   - 适合存储复杂计算的中间结果。
   - 可用于跨合约调用时的临时数据传递。
   - 适合需要在单个交易中进行多次读写的数据。

通过在合适的场景中应用瞬态存储，开发者可以显著提升合约的 Gas 效率，从而为用户节省成本并提高交易的整体性能。


## 参考
EIP-1153