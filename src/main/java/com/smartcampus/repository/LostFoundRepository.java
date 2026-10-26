package com.smartcampus.repository;

import com.smartcampus.model.ItemStatus;
import com.smartcampus.model.ItemType;
import com.smartcampus.model.LostFoundItem;
import com.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundRepository extends JpaRepository<LostFoundItem, Long> {
    List<LostFoundItem> findAllByOrderByCreatedAtDesc();
    List<LostFoundItem> findByTypeOrderByCreatedAtDesc(ItemType type);
    List<LostFoundItem> findByReportedByOrderByCreatedAtDesc(User user);
    List<LostFoundItem> findByStatus(ItemStatus status);
}
