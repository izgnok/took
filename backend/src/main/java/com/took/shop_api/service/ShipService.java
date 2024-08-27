package com.took.shop_api.service;

import com.took.shop_api.dto.AddShipRequest;
import com.took.shop_api.dto.UpdateShipRequest;
import com.took.shop_api.entity.ShipInfo;
import com.took.shop_api.entity.Shop;
import com.took.shop_api.repository.ShipRepository;
import com.took.shop_api.repository.ShopRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ShipService {

    private final ShipRepository shipRepository;
    private final ShopRepository shopRepository;

    @Transactional
    public ShipInfo save(AddShipRequest request) {
        Shop shop = shopRepository.findById(request.getShopSeq()).orElseThrow();
        ShipInfo shipInfo = ShipInfo.builder()
                .shop(shop)
                .courier(request.getCourier())
                .invoiceNum(request.getInvoiceNum())
                .build();
        return shipRepository.save(shipInfo);
    }

    @Transactional
    public ShipInfo findByShopSeq(Long id){
        Shop shop = shopRepository.findById(id).orElseThrow();
        return shipRepository.findByShop(shop);
    }

    @Transactional
    public void delete(Long id){
        shipRepository.deleteById(id);
    }

    @Transactional
    public ShipInfo update(long id, UpdateShipRequest request) {
        ShipInfo ship = shipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found : " + id));

        ship.update(request);

        return ship;
    }
}