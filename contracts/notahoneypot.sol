// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Notahoneypot {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function checkBasicTokenProperties(
        address tokenAddress
    ) public view returns (bool) {
        IERC20 token = IERC20(tokenAddress);

        try token.totalSupply() {} catch {
            return false;
        }
        try token.balanceOf(address(this)) {} catch {
            return false;
        }

        return true;
    }

    struct HoneyPot {
        bool isHoneyPot;
        address base;
        address token;
        uint256 estimatedBuy;
        uint256 buyAmount;
        uint256 estimatedSell;
        uint256 sellAmount;
        uint256 buyGas;
        uint256 sellGas;
    }

    function isHoneyPot(
        address native_token,
        address router,
        address base,
        address token
    ) public payable returns (HoneyPot memory) {
        HoneyPot memory response;
        bool success;
        uint256 amount;
        uint256 estimatedBuyAmount;
        uint256 buyAmount;
        uint256 sellAmount;
        uint256 estimatedSellAmount;
        address[] memory path = new address[](2);
        uint256[] memory gas = new uint256[](2);

        if (base == native_token) {
            success = deposit(base, msg.value);
            if (success == false) {
                response = failed(token, base);
                return response;
            }
        } else {
            success = deposit(native_token, msg.value);
            if (success == false) {
                response = failed(token, base);
                return response;
            }
            success = swapnCheck(native_token, base, router);
            if (success == false) {
                response = failed(token, base);
                return response;
            }
        }

        success = approve(base, router);
        if (success == false) {
            response = failed(token, base);
            return response;
        }

        amount = balanceOf(base);
        path[0] = base;
        path[1] = token;
        (success, estimatedBuyAmount) = getAmountsOut(router, amount, path);
        if (success == false) {
            response = failed(token, base);
            return response;
        }
        gas[0] = gasleft();
        success = swap(router, amount, path);
        if (success == false) {
            response = failed(token, base);
            return response;
        }
        gas[0] = gas[0] - gasleft();
        buyAmount = balanceOf(token);

        path[0] = token;
        path[1] = base;
        success = approve(token, router);
        if (success == false) {
            response = failed(token, base);
            return response;
        }
        (success, estimatedSellAmount) = getAmountsOut(router, buyAmount, path);
        if (success == false) {
            response = failed(token, base);
            return response;
        }
        gas[1] = gasleft();
        success = swap(router, buyAmount, path);
        if (success == false) {
            response = failed(token, base);
            return response;
        }
        gas[1] = gas[1] - gasleft();
        sellAmount = balanceOf(base);

        response = HoneyPot(
            false,
            base,
            token,
            estimatedBuyAmount,
            buyAmount,
            estimatedSellAmount,
            sellAmount,
            gas[0],
            gas[1]
        );

        return response;
    }

    function failed(
        address token,
        address base
    ) public pure returns (HoneyPot memory) {
        HoneyPot memory response;
        response = HoneyPot(true, base, token, 0, 0, 0, 0, 0, 0);
        return response;
    }

    function deposit(
        address to,
        uint256 amount
    ) public payable returns (bool success) {
        assembly {
            mstore(0, hex"d0e30db0")
            let _s := call(gas(), to, amount, 0, 4, 0, 0)
            switch _s
            case 0 {
                success := false
            }
            case 1 {
                success := true
            }
        }
    }

    function balanceOf(address to) public view returns (uint256 amount) {
        (, bytes memory data) = to.staticcall(
            abi.encodeWithSignature("balanceOf(address)", address(this))
        );

        amount = abi.decode(data, (uint256));

        return amount;
    }

    function approve(
        address to,
        address token
    ) public payable returns (bool success) {
        uint256 approveInf = type(uint256).max;
        (success, ) = to.call(
            abi.encodeWithSignature(
                "approve(address,uint256)",
                token,
                approveInf
            )
        );
        if (success == false) {
            return false;
        }
        return true;
    }

    function getAmountsOut(
        address router,
        uint256 amountIn,
        address[] memory path
    ) public view returns (bool success, uint256 amount) {
        (bool _s, bytes memory data) = router.staticcall(
            abi.encodeWithSignature(
                "getAmountsOut(uint256,address[])",
                amountIn,
                path
            )
        );
        if (_s == false) {
            return (false, 0);
        }
        uint256[] memory amounts = abi.decode(data, (uint256[]));

        return (true, amounts[1]);
    }

    function swap(
        address router,
        uint256 amountIn,
        address[] memory path
    ) public payable returns (bool) {
        (bool success, ) = router.call(
            abi.encodeWithSignature(
                "swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)",
                amountIn,
                1,
                path,
                address(this),
                block.timestamp + 60
            )
        );
        if (success == false) {
            return false;
        }
        return true;
    }

    function swapnCheck(
        address native_token,
        address token,
        address router
    ) public payable returns (bool success) {
        address[] memory path = new address[](2);

        path[0] = native_token;
        path[1] = token;

        uint256 amountIn = balanceOf(native_token);

        bool _s = approve(native_token, router);
        if (_s == false) {
            return false;
        }

        _s = swap(router, amountIn, path);
        if (_s == false) {
            return false;
        }
        return true;
    }
}
