# 销毁合约
EVM（以太坊虚拟机）中的智能合约有可能需要被销毁，以便回收网络资源和以太币。在 EVM 中销毁合约的主要途径是使用 Solidity 编程语言中的 selfdestruct 函数。这个函数能够删除合约，并发送合约中所有剩余的以太币（Ether）到一个指定的地址。使用 selfdestruct 不仅可以清理智能合约本身，还可以将合约持有的所有余额转移给指定地址。

selfdestruct 使用步骤:

1. 确定销毁条件： 最初在合约中需要设置一些条件来确定何时可以调用 selfdestruct 函数。这通常会涉及权限的检查，确保只有合约的拥有者或具有相应权限的账户可以销毁合约。
2. 编写 selfdestruct 调用：在 Solidity 中，selfdestruct 接收一个参数，这个参数是一个以太坊地址，表明在销毁合约时，所有剩余的以太币应该发送到这个地址。

示例代码：

下面是一个简单的智能合约示例，展示如何使用 selfdestruct 来销毁合约：

```
contract SelfDestructor {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function destroy(address recipient) public payable {
        require(msg.sender == owner, "Only owner can call this function");

        // 销毁合约，并将余额发送到指定的地址
        selfdestruct(payable(recipient));
    }
}
```

在这个示例中，destroy 函数检查调用者是否为合约的所有者。如果是，它会调用 selfdestruct 并将所有剩余的以太币发送到所有者的地址。

注意事项：
- 权限控制： 由于使用 selfdestruct 后合约代码被移除，因此确保只有合法和合适的用户（通常是合约创建者或管理员）可以调用这一函数是很重要的。
- 意外的合约销毁： 为避免恶意攻击或误操作，合约的销毁操作应该被慎重对待。
- 合约余额： 销毁合约之前，需考虑将合约中的余额转移到安全的地址或处理完毕。

利用 selfdestruct，智能合约开发者可以有效地管理合约的生命周期和相关的以太坊资源。

## 相关
- [代码](../contracts/basic/SelfDestructor.sol)，[测试用例](../test/basic/selfDestructor.js)
- [EIP-6049: Deprecate SELFDESTRUCT](https://eips.ethereum.org/EIPS/eip-6049)