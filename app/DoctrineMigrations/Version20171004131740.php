<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171004131740 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE `document_accurring` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `kontragent_id` INT(6) UNSIGNED DEFAULT NULL,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_accurring_row` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `document_id` INT(11) UNSIGNED DEFAULT NULL,
            `service_id` INT(11) UNSIGNED DEFAULT NULL,
            `price` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `period` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `calc_base` DECIMAL(11,3) NOT NULL DEFAULT 0,
            `komment` VARCHAR(255) NOT NULL,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_pay` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `kontragent_id` INT(6) UNSIGNED DEFAULT NULL,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_pay_row` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `document_id` INT(11) UNSIGNED DEFAULT NULL,
            `service_id` INT(11) UNSIGNED DEFAULT NULL,
            `sum` DECIMAL(7,2) NOT NULL DEFAULT 0,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `document_accurring`;
            DROP TABLE `document_accurring_row`;
            DROP TABLE `document_pay`;
            DROP TABLE `document_pay_row`;
        ');
    }
}
