const ethers = require('ethers');

// 定义合约的ABI
const abi = [
    "function transfer(address to, uint256 amount)"
];

// 创建 Interface 实例
const iface = new ethers.Interface(abi);

// 准备要编码的数据
const to = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const amount = ethers.parseUnits("1.0", 18);  // 将 1.0 ether 转换为 wei

// 编码函数调用
const encodedData = iface.encodeFunctionData("transfer", [to, amount]);

console.log(`Encoded data: ${encodedData}`, encodedData.length);